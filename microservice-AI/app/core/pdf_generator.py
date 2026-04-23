
from xhtml2pdf import pisa
from io import BytesIO
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

def generate_cv_pdf(data: Dict[str, Any]) -> BytesIO:
    """Generate a professional PDF CV from structured data using an HTML template."""
    
    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @page {{
                size: a4;
                margin: 1.5cm;
            }}
            body {{
                font-family: 'Times-Roman', 'serif';
                color: #000;
                line-height: 1.4;
                font-size: 10pt;
            }}
            .header {{
                text-align: center;
                margin-bottom: 25px;
            }}
            .name {{
                font-size: 20pt;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 2px;
            }}
            .title {{
                font-size: 15pt;
                font-weight: bold;
                margin-bottom: 5px;
            }}
            .contact {{
                font-size: 9pt;
                margin-bottom: 15px;
            }}
            .section-title {{
                font-size: 11pt;
                font-weight: bold;
                border-bottom: 1px solid #000;
                margin-top: 15px;
                margin-bottom: 8px;
                text-transform: uppercase;
                padding-bottom: 2px;
            }}
            .item-container {{
                margin-bottom: 12px;
            }}
            .item-line-1 {{
                font-weight: bold;
                display: block;
            }}
            .item-line-2 {{
                font-weight: bold;
                font-size: 10pt;
            }}
            .date-right {{
                float: right;
                font-weight: bold;
            }}
            ul {{
                margin-top: 2px;
                margin-bottom: 5px;
                padding-left: 20px;
            }}
            li {{
                margin-bottom: 2px;
            }}
            .skills-section {{
                margin-top: 5px;
            }}
            .skill-category {{
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">{data.get('full_name', 'FIRST LAST')}</div>
            <div class="title">{data.get('target_job', 'Junior Full-Stack Developer')}</div>
            <div class="contact">
                Tunis, Tunisia • {data.get('email', 'candidat@email.com')} • {data.get('phone', '+216 123 456')}
            </div>
        </div>

        <div class="section-title">Professional Experience</div>
        """
    
    for exp in data.get('experiences', []):
        html_template += f"""
        <div class="item-container">
            <div class="date-right">{exp.get('duration', '')}</div>
            <div class="item-line-1">{exp.get('company', '')}</div>
            <div class="item-line-2">{exp.get('title', '')}</div>
            <ul>
        """
        for resp in exp.get('responsibilities', []):
            html_template += f'<li>{resp}</li>'
        html_template += "</ul></div>"

    if data.get('projects'):
        html_template += '<div class="section-title">Personal Projects</div>'
        for proj in data.get('projects', []):
            tech_str = ", ".join(proj.get('technologies', []))
            html_template += f"""
            <div class="item-container">
                <div class="item-line-1">{proj.get('title', '')} <i>({tech_str})</i></div>
                <div class="summary">{proj.get('description', '')}</div>
            </div>
            """

    html_template += '<div class="section-title">Education</div>'
    for edu in data.get('education', []):
        html_template += f'<div class="item-container">{edu}</div>'

    if data.get('skills'):
        html_template += '<div class="section-title">Additional Information</div>'
        html_template += f'<div class="skills-section"><strong>Technical Skills:</strong> {", ".join(data.get("skills", []))}</div>'

    html_template += """
    </body>
    </html>
    """
    
    result = BytesIO()
    pisa_status = pisa.CreatePDF(
       html_template,                # the HTML to convert
       dest=result)                 # file handle to recieve result
    
    if not pisa_status.err:
        return result
    else:
        logger.error(f"PDF generation error: {pisa_status.err}")
        return None
