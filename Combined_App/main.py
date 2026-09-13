import io
import os
import re
import cv2
import numpy as np
import base64
from PIL import Image
import torch
import easyocr

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from src.forensics import extract_forensic_features
from src.rules import run_document_rules, calculate_risk_score
from app import load_ocr, load_ocr_reader_multi, load_forgery_model, cnn_transforms, generate_ela, preprocess_image, extract_ocr_dl, get_risk_score_dl, generate_gradcam

app = FastAPI(title="BORDER-AI API")

# Mount the static directory
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), "app/static")), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def encode_image(img):
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode('utf-8')

def encode_pil_image(img):
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

@app.post("/api/ml-forensics")
async def ml_forensics(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # OCR
        reader = load_ocr()
        ocr_results = reader.readtext(image_cv)
        extracted_text = [res[1] for res in ocr_results]
        
        mrz_lines = [text for text in extracted_text if '<' in text]
        mrz = "".join(mrz_lines)
        
        dob_match = re.search(r'\b\d{2}/\d{2}/\d{4}\b', " ".join(extracted_text))
        dob = dob_match.group() if dob_match else 'Not found'
        
        # Forensics
        forensics = extract_forensic_features(image_cv)
        
        visual_name = "KHALED" if "KHALED" in " ".join(extracted_text) else "UNKNOWN"
        extracted_data = {"mrz": mrz, "visual_name": visual_name, "mrz_name": mrz}
        rules = run_document_rules(extracted_data)
        
        risk = calculate_risk_score(0.2, forensics, rules)
        
        return {
            "mrz_detected": mrz_lines,
            "mrz_text": mrz,
            "dob": dob,
            "ela_max": float(forensics.get('ela_max', 0)),
            "copy_move_score": float(forensics.get('copy_move_score', 0)),
            "risk_score": int(risk['score']),
            "risk_status": risk['status'],
            "risk_reasons": risk['reasons'],
            "original_image": encode_image(image_cv)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/dl-forensics")
async def dl_forensics(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        ocr_data = extract_ocr_dl(image)
        preprocessed_img = preprocess_image(image)
        ela_map = generate_ela(image)
        
        model, device = load_forgery_model()
        gradcam_img = generate_gradcam(image, model, device)
        
        score, reasons = get_risk_score_dl(image, ocr_data)
        
        if score < 30:
            risk_level = "LOW RISK"
        elif score < 60:
            risk_level = "MEDIUM RISK"
        else:
            risk_level = "HIGH RISK"

        return {
            "ocr_data": ocr_data,
            "score": score,
            "risk_level": risk_level,
            "reasons": reasons,
            "preprocessed_img": encode_image(preprocessed_img),
            "ela_map": encode_pil_image(ela_map),
            "gradcam_img": encode_image(gradcam_img)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/eda")
async def run_eda():
    try:
        from src.eda import perform_eda
        perform_eda()
        return {"status": "success", "message": "EDA completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/train")
async def run_train():
    try:
        from src.train import run_training_pipeline
        run_training_pipeline()
        return {"status": "success", "message": "Training completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/identity-graph")
async def get_identity_graph():
    try:
        import networkx as nx
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        import matplotlib.patches as mpatches
        import io
        import base64

        G = nx.Graph()
        nodes_data = [
            ("Face_Alpha", {"type": "Biometric", "color": "#1f77b4", "risk": "High"}),
            ("Passport_US_123", {"type": "Document", "color": "#2ca02c", "risk": "Low"}),
            ("Passport_UK_456", {"type": "Document", "color": "#d62728", "risk": "Critical"}),
            ("Face_Beta", {"type": "Biometric", "color": "#1f77b4", "risk": "Low"}),
            ("Passport_CAN_789", {"type": "Document", "color": "#2ca02c", "risk": "Low"}),
            ("Phone_555_0199", {"type": "Contact", "color": "#ff7f0e", "risk": "High"}),
            ("Flight_BA101", {"type": "Travel", "color": "#9467bd", "risk": "Medium"}),
            ("Flight_EK202", {"type": "Travel", "color": "#9467bd", "risk": "Medium"})
        ]
        G.add_nodes_from(nodes_data)
        
        edges_data = [
            ("Face_Alpha", "Passport_US_123", {"weight": 0.99, "relation": "Matches Photo"}),
            ("Face_Alpha", "Passport_UK_456", {"weight": 0.95, "relation": "Matches Photo"}),
            ("Passport_US_123", "Phone_555_0199", {"weight": 0.8, "relation": "Used for booking"}),
            ("Passport_UK_456", "Flight_BA101", {"weight": 0.9, "relation": "Passenger"}),
            ("Face_Beta", "Passport_CAN_789", {"weight": 0.98, "relation": "Matches Photo"}),
            ("Passport_CAN_789", "Phone_555_0199", {"weight": 0.8, "relation": "Used for booking"}),
            ("Passport_CAN_789", "Flight_EK202", {"weight": 0.9, "relation": "Passenger"}),
            ("Flight_BA101", "Flight_EK202", {"weight": 0.5, "relation": "Same Booking IP"})
        ]
        G.add_edges_from([(u, v, attr) for u, v, attr in edges_data])
        
        fig, ax = plt.subplots(figsize=(10, 7))
        pos = nx.spring_layout(G, seed=42, k=0.5)
        nx.draw_networkx_edges(G, pos, ax=ax, alpha=0.5, width=2)
        colors = [nx.get_node_attributes(G, 'color')[node] for node in G.nodes()]
        nx.draw_networkx_nodes(G, pos, ax=ax, node_color=colors, node_size=1500, edgecolors='white', linewidths=2)
        nx.draw_networkx_labels(G, pos, ax=ax, font_size=9, font_weight="bold")
        edge_labels = {(u, v): d['relation'] for u, v, d in G.edges(data=True)}
        nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=7, ax=ax)
        
        legend_elements = [
            mpatches.Patch(color='#1f77b4', label='Biometric (Face)'),
            mpatches.Patch(color='#2ca02c', label='Clean Document'),
            mpatches.Patch(color='#d62728', label='Forged Document'),
            mpatches.Patch(color='#ff7f0e', label='Contact Info'),
            mpatches.Patch(color='#9467bd', label='Travel Record')
        ]
        ax.legend(handles=legend_elements, loc='upper right', bbox_to_anchor=(1.15, 1))
        plt.axis('off')
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        
        return {"image": f"data:image/png;base64,{img_base64}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
