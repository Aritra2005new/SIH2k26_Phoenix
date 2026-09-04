import re

from matching.model_loader import load_matcher


matcher, _ = load_matcher()

startup_df = matcher["df"].copy()


def normalize_name(name):

    name = str(name).strip().lower()

    name = re.sub(
        r"[^a-zA-Z0-9\s]",
        " ",
        name
    )

    name = re.sub(
        r"\s+",
        " ",
        name
    ).strip()

    return name


startup_df["_normalized_name"] = (
    startup_df["name"]
    .astype(str)
    .apply(normalize_name)
)


def find_ml_startup(startup_name):

    normalized_name = normalize_name(
        startup_name
    )

    matches = startup_df[
        startup_df["_normalized_name"]
        == normalized_name
    ]

    if matches.empty:
        return None

    return matches.iloc[0]