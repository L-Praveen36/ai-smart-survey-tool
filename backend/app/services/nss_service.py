# backend/app/services/nss_service.py

def get_questions_from_template(template_type: str):
    templates = {
        "household_basic": [
            {
                "question_text": "What is the total number of family members?",
                "question_type": "text",
                "nss_code": "HH001",
                "order_index": 1,
                "is_mandatory": True,
                "translations": {"hi": "कुल पारिवारिक सदस्यों की संख्या क्या है?"},
                "audio_file_uri": None,
                "voice_enabled": False,
                "audio_metadata": {},
                "adaptive_enabled": True,
                "adaptive_config": {},
                "ai_generated": False,
                "ai_metadata": {}
            },
            {
                "question_text": "What is the type of housing?",
                "question_type": "radio",
                "options": ["Kaccha", "Semi-Pucca", "Pucca"],
                "nss_code": "HH002",
                "order_index": 2,
                "is_mandatory": True,
                "translations": {"hi": "आवास का प्रकार क्या है?"},
                "audio_file_uri": None,
                "voice_enabled": False,
                "audio_metadata": {},
                "adaptive_enabled": True,
                "adaptive_config": {},
                "ai_generated": False,
                "ai_metadata": {}
            },
            {
                "question_text": "Is the household connected to electricity?",
                "question_type": "radio",
                "options": ["Yes", "No"],
                "nss_code": "HH003",
                "order_index": 3,
                "is_mandatory": True,
                "translations": {"hi": "क्या घर में बिजली की सुविधा है?"},
                "audio_file_uri": None,
                "voice_enabled": False,
                "audio_metadata": {},
                "adaptive_enabled": True,
                "adaptive_config": {},
                "ai_generated": False,
                "ai_metadata": {}
            }
        ],
        "education_children": [
            {
                "question_text": "How many children are currently enrolled in school?",
                "question_type": "text",
                "nss_code": "EDU001",
                "order_index": 1,
                "is_mandatory": True,
                "translations": {"hi": "वर्तमान में स्कूल में नामांकित बच्चों की संख्या कितनी है?"},
                "audio_file_uri": None,
                "voice_enabled": False,
                "audio_metadata": {},
                "adaptive_enabled": True,
                "adaptive_config": {},
                "ai_generated": False,
                "ai_metadata": {}
            },
            {
                "question_text": "Do all children have access to digital learning tools?",
                "question_type": "radio",
                "options": ["Yes", "No", "Partially"],
                "nss_code": "EDU002",
                "order_index": 2,
                "is_mandatory": False,
                "translations": {"hi": "क्या सभी बच्चों को डिजिटल लर्निंग टूल्स की सुविधा है?"},
                "audio_file_uri": None,
                "voice_enabled": False,
                "audio_metadata": {},
                "adaptive_enabled": True,
                "adaptive_config": {},
                "ai_generated": False,
                "ai_metadata": {}
            }
        ]
    }

    return templates.get(template_type, [])
