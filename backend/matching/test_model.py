from matching.model_loader import load_matcher


def test_model_loading():

    matcher, embedding_model = load_matcher()

    print("\n===== ML MODEL LOADED =====")
    print("Model name:", matcher["model_name"])
    print("Startup records:", len(matcher["df"]))
    print("Embedding shape:", matcher["startup_embeddings"].shape)
    print("===========================\n")