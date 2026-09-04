import os
import pickle

from django.conf import settings
from sentence_transformers import SentenceTransformer


MATCHER_PATH = os.path.join(
    settings.BASE_DIR,
    "ml_models",
    "Ai_Integrated_startup_matcher.pkl"
)

MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    "ml_models",
    "all-MiniLM-L6-v2"
)


def load_matcher():

    # Load trained matcher
    with open(MATCHER_PATH, "rb") as f:
        matcher = pickle.load(f)

    # Load embedding model from local files
    embedding_model = SentenceTransformer(
        MODEL_PATH,
        local_files_only=True
    )

    return matcher, embedding_model

# import os
# import pickle

# from django.conf import settings
# from sentence_transformers import SentenceTransformer


# MODEL_PATH = os.path.join(
#     settings.BASE_DIR,
#     "ml_models",
#     "Ai_Integrated_startup_matcher.pkl"
# )


# def load_matcher():

#     with open(MODEL_PATH, "rb") as f:
#         matcher = pickle.load(f)

#     embedding_model = SentenceTransformer(
#         matcher["model_name"]
#     )

#     return matcher, embedding_model