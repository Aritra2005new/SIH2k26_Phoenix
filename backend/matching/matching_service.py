import re

from sklearn.metrics.pairwise import cosine_similarity

from .model_loader import load_matcher


# Load ML artifact and embedding model once
matcher, embedding_model = load_matcher()

startup_df = matcher["df"]
startup_embeddings = matcher["startup_embeddings"]
boost_amount = matcher["boost_amount"]


def clean_text(text):
    """
    Same cleaning logic used during training.
    """

    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


def domain_boost(challenge_text, startup_domains):
    """
    Same domain boost logic used in the notebook.
    """

    challenge_lower = challenge_text.lower()

    domains_list = [
        d.strip().lower()
        for d in startup_domains.split(",")
    ]

    for domain in domains_list:

        domain_words = domain.split()

        if any(
            word in challenge_lower
            for word in domain_words
            if len(word) > 3
        ):
            return boost_amount

    return 0


def get_recommendations(challenge_text, top_k=5):
    """
    Generate startup recommendations for a challenge.
    """

    # -----------------------------------
    # 1. Clean challenge text
    # -----------------------------------

    cleaned_challenge = clean_text(challenge_text)


    # -----------------------------------
    # 2. Generate challenge embedding
    # -----------------------------------

    challenge_embedding = embedding_model.encode(
        [cleaned_challenge]
    )


    # -----------------------------------
    # 3. Calculate cosine similarity
    # -----------------------------------

    similarity_scores = cosine_similarity(
        challenge_embedding,
        startup_embeddings
    ).flatten()


    # -----------------------------------
    # 4. Build recommendation results
    # -----------------------------------

    results = []

    for index, semantic_score in enumerate(similarity_scores):

        startup = startup_df.iloc[index]

        boost = domain_boost(
            cleaned_challenge,
            startup["domains"]
        )

        final_score = float(semantic_score) + boost

        results.append({
            "startup_id": startup["id"],
            "startup_name": startup["name"],
            "semantic_score": float(semantic_score),
            "domain_boost": float(boost),
            "match_score": final_score,
        })


    # -----------------------------------
    # 5. Rank highest → lowest
    # -----------------------------------

    results.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )


    # -----------------------------------
    # 6. Return top K startups
    # -----------------------------------

    return results[:top_k]