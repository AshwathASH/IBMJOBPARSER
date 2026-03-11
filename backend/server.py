import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber

app = Flask(__name__)
CORS(app)

SKILL_KEYWORDS = [
    {"name": "React", "keywords": ["react", "react.js", "reactjs"]},
    {"name": "TypeScript", "keywords": ["typescript", "ts"]},
    {"name": "JavaScript", "keywords": ["javascript", "js", "es6"]},
    {"name": "Node.js", "keywords": ["node.js", "nodejs", "node"]},
    {"name": "Python", "keywords": ["python", "django", "flask"]},
    {"name": "Java", "keywords": ["java", "spring", "springboot"]},
    {"name": "AWS", "keywords": ["aws", "amazon web services", "ec2", "s3", "lambda"]},
    {"name": "Docker", "keywords": ["docker", "container", "dockerfile"]},
    {"name": "Kubernetes", "keywords": ["kubernetes", "k8s"]},
    {"name": "SQL", "keywords": ["sql", "mysql", "postgresql", "postgres", "database"]},
    {"name": "GraphQL", "keywords": ["graphql", "apollo"]},
    {"name": "Git", "keywords": ["git", "github", "gitlab"]},
    {"name": "CSS", "keywords": ["css", "tailwind", "sass", "scss", "styled-components"]},
    {"name": "HTML", "keywords": ["html", "html5"]},
    {"name": "MongoDB", "keywords": ["mongodb", "mongo", "nosql"]},
    {"name": "CI/CD", "keywords": ["ci/cd", "jenkins", "github actions", "pipeline"]},
    {"name": "REST API", "keywords": ["rest", "api", "restful"]},
    {"name": "Agile", "keywords": ["agile", "scrum", "sprint", "kanban"]},
]


def extract_text(file_storage):
    """Extract text from uploaded file using pdfplumber for PDFs, plain read for txt."""
    filename = file_storage.filename or ""
    ext = os.path.splitext(filename)[1].lower()

    if ext == ".pdf":
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            file_storage.save(tmp.name)
            tmp_path = tmp.name

        text = ""
        try:
            with pdfplumber.open(tmp_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        finally:
            os.unlink(tmp_path)
        return text

    # For txt/docx/doc fall back to reading as text
    return file_storage.read().decode("utf-8", errors="ignore")


@app.route("/api/analyze-resume", methods=["POST"])
def analyze_resume():
    """General resume analysis — detect skills, score, strengths, gaps."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    text = extract_text(file)
    content = text.lower()

    import random

    detected = []
    for sk in SKILL_KEYWORDS:
        found = any(kw in content for kw in sk["keywords"])
        detected.append({
            "name": sk["name"],
            "level": random.randint(65, 95) if found else random.randint(15, 45),
            "matched": found,
        })

    detected.sort(key=lambda s: s["level"], reverse=True)
    detected = detected[:8]

    matched_count = sum(1 for s in detected if s["matched"])
    score = min(99, max(40, round((matched_count / len(detected)) * 100 + random.random() * 10)))

    strengths = [s["name"] for s in detected if s["matched"] and s["level"] >= 70][:4]
    gaps = [s["name"] for s in detected if not s["matched"]][:4]

    return jsonify({
        "extractedText": text[:500],
        "skills": detected,
        "score": score,
        "strengths": strengths,
        "gaps": gaps,
    })


@app.route("/api/analyze-for-job", methods=["POST"])
def analyze_for_job():
    """Match resume skills against a specific job's required skills."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    required_skills = request.form.getlist("skills")

    if not required_skills:
        skills_raw = request.form.get("skills", "")
        required_skills = [s.strip() for s in skills_raw.split(",") if s.strip()]

    text = extract_text(file)
    content = text.lower()

    matched = []
    not_matched = []

    for req_skill in required_skills:
        skill_def = next(
            (sk for sk in SKILL_KEYWORDS if sk["name"].lower() == req_skill.lower()),
            None,
        )
        keywords = skill_def["keywords"] if skill_def else [req_skill.lower()]
        found = any(kw in content for kw in keywords)
        if found:
            matched.append(req_skill)
        else:
            not_matched.append(req_skill)

    return jsonify({
        "extractedText": text[:500],
        "matched": matched,
        "notMatched": not_matched,
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)
