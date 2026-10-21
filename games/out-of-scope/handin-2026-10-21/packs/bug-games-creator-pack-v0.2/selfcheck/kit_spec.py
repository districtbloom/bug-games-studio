"""The rules the harness checks against. Every value cites where it comes from.

SDK  = the bug.games SDK reference (the bug.games connector's sdk_docs; the game.json part is in the creator pack's SDK_NOTES.md)
KIT  = CREATOR_KIT.md (creator pack, page-contract/: art tiers, sizes, fallbacks, self-check)
INV  = the platform's surface list (internal; cited here only as "surface list")
UK   = the Game upload kit doc (creator pack UPLOAD_KIT.md; its 19 open questions)
GP   = GAMEPAGE.md (creator pack, page-contract/: the shared game page, required hooks)
FEAT = the Featured (pick of the week) slot on Home
TPL  = manifest.template.json (creator pack: the package format, master sizes)
Nothing here is decided by the harness: an open question is reported as UNDECIDED, never resolved.
"""

# ---- the upload kit's 19 open questions (UK, "Gaps and open questions"), verbatim titles ----
OPEN_QUESTIONS = {
    1: "Which item types can a game sell, and is there a price guide?",
    2: "Do per-game starter packs, bundles, featured items or sales exist?",
    3: "What is the cover?",
    4: "How long is a pass, and how many bug.pass rewards does it hold?",
    5: "How fast does a pass fill?",
    6: "Can a pass or event hand out crumbs, and who pays for them?",
    7: "Can a tier-1 game get a game page today?",
    8: "Tags: who sets them, how many, from which list?",
    9: "Mood (SDK, 17 words) or vibes (canvas, 7) — or both?",
    10: "What is the \"small gift\" for games without a pass?",
    11: "Can Free creators sell looks?",
    12: "Are members-only chapters allowed?",
    13: "Leaderboards: score type, scope, what a revive tag means",
    14: "Daily Bug and XP: does a game report anything?",
    15: "More like this: what rule picks neighbours?",
    16: "Size and load budget",
    17: "Gameplay media sizes (screenshots, trailer)",
    18: "Are item purchases refundable?",
    19: "One source for game facts",
}

# ---- game.json (SDK "Storefront metadata") ----
SDK_FIELDS = {"title", "hook", "description", "mood", "genre", "minutes", "tags", "players", "coop", "inputs",
              "permissions", "controls", "moments", "cover", "screenshots", "trailer", "accent", "contentNote",
              "jam", "products", "pass", "memberGift"}
MOODS = ["thrilling", "tense", "frantic", "brutal", "triumphant", "cosy", "gentle", "homely", "meditative",
         "curious", "playful", "strange", "clever", "tender", "melancholy", "lonely", "bittersweet"]
INPUTS = ["keyboard", "mouse", "touch", "gamepad"]
PERMISSIONS = ["microphone", "camera"]
PRODUCT_KINDS = ["consumable", "durable"]

# ---- words (KIT W + self-check 11, UK "Words never allowed", surface list copy lint) ----
TITLE_MAX = 40          # KIT W
PLACE_MAX = 30          # KIT W
LEAD_WARN = 110         # surface list one line ≤110 (build warns)
MOMENTS_MAX = 12        # SDK
TAGS_MAX_SDK = 5        # SDK
TAGS_MAX_PUBLISH = 4    # CreatePublish (surface list) -> Q8
TAG_LEN = (2, 24)       # SDK
BANNED = [  # (regex, label, source)
    (r"\bteardown\b", "teardown", "KIT self-check 11, founder decisions"),
    (r"\bfair\s*play\b", "Fair Play", "founder decisions, KIT self-check 11"),
    (r"\bstreaks?\b", "streak", "KIT self-check 11"),
    (r"\bonly\s+\d+\s+(left|remaining)\b", "only N left", "surface list, KIT self-check 11"),
    (r"\b(sells? out|selling fast|last chance|hurry)\b", "scarcity", "UK words"),
    (r"\b(best|greatest|ultimate|most addictive|number one|#1)\b", "superlative", "UK words (superlatives about the game)"),
]
GAME_SPEAK = [r"\blevel\b", r"\benem(y|ies)\b"]   # KIT W: game-speak in the words (place, verb, stat nouns) only

# ---- platform colours (KIT self-check 5, art-direction guide (colour guard)) ----
PLATFORM_COLOURS = {"ember": "#FF5A36", "lilac": "#C4B5FF", "sun": "#FFCB57"}
GUARD_DE, CAUTION_DE = 12, 20

# ---- art slots. size: exact (w,h) masters; ratio: w/h; minimum: (w,h); tier; status per source ----
# alias lists map whatever a package calls a slot onto one canonical slot.
SLOTS = {
    "poster":        dict(tier=1, ratio=2.0, min=(1600, 800), src="KIT 1 (2:1, ≥1600×800)", alias=["poster_master", "poster_still", "held_still", "poster_2x1"]),
    "poster_tall":   dict(tier=1, ratio=2 / 3, src="KIT 1 crop 2:3", alias=["poster_2x3", "tall", "poster_portrait", "crop_2x3"]),
    "poster_square": dict(tier=1, ratio=1.0, src="KIT 1 crop 1:1", alias=["poster_1x1", "square", "crop_1x1"]),
    "icon":          dict(tier=1, exact=(92, 92), src="KIT 2 icon 46 (92×92)", alias=["icon46", "icon_46"]),
    "emblem":        dict(tier=1, exact=(60, 60), src="KIT 3 emblem 30 (60×60)", alias=["emblem30", "emblem_30"]),
    "key_still":     dict(tier=1, exact=(720, 352), src="KIT 4 key still 720×352", alias=["keystill", "cont", "continue", "continue_still"]),
    "result_still":  dict(tier=1, exact=(1600, 352), src="KIT 5 result still 1600×352", alias=["result"]),
    "seal":          dict(tier=1, exact=(96, 96), alt=[(192, 192)], src="KIT 6 seals 96×96 (192 @2x)", alias=["seals", "achievement"], per="moment"),
    "pass_reward":   dict(tier=1, exact=(306, 243), alt=[(612, 486)], src="KIT 7 pass rewards 306×243", alias=["reward", "rw", "pass_rewards", "pass_rw"], per="reward"),
    "store_item":    dict(tier=1, exact=(400, 400), src="KIT 8 store items 400×400", alias=["store", "item", "store_items", "product"], per="product"),
    "marker":        dict(tier=1, max=(48, 48), src="KIT 9 marker ≤48×48, two poses", alias=["marker_next", "marker_held"], per="pose"),
    "share_card":    dict(tier=2, exact=(1200, 630), src="KIT T2 share card 1200×630", alias=["share", "og", "og_card"]),
    "event_banner":  dict(tier=2, exact=(1720, 600), src="KIT T2 event banner 1720×600, left 45% plain", alias=["event", "banner", "event_art"], per="event"),
    "update":        dict(tier=2, ratio=2.0, min=(308, 154), src="KIT T2 update close-up, thumb 308×154", alias=["update_closeup", "closeup", "update_close_up"], per="update"),
    "chip64":        dict(tier=2, exact=(128, 128), alt=[(64, 64), (64, 48), (128, 96)], src="KIT T2 chip 64 (TPL master 128×128; Home draws 64×64, a 64×48 variant exists on the surface list)", alias=["chip", "chip_64"]),
    "wide":          dict(tier=2, exact=(660, 308), alt=[(1320, 616)], src="TPL wide 660×308 (wide capsule crop)", alias=["poster_wide", "poster_wide_crop", "wide_crop", "capsule_wide"]),
    "phone_916":     dict(tier=2, ratio=9 / 16, src="KIT T2 phone 9:16", alias=["phone", "phone_9x16", "poster_9x16"]),
    "title_lockup":  dict(tier=2, src="KIT T2 title lockup (fixed-size pieces)", alias=["lockup", "lettering"]),
    "backdrop":      dict(tier=0, exact=(1440, 577), alt=[(2880, 1154)], src="GP §4 backdrop 1440×577 (optional)", alias=["backdrop_desktop", "stage"]),
    "backdrop_mobile": dict(tier=0, exact=(390, 826), alt=[(780, 1652)], src="GP §4 backdrop 390×826 (optional)", alias=["backdrop_phone", "backdrop_m"]),
    "featured_still": dict(tier=2, ratio=1268 / 440, min=(1268, 440), src="FEAT slot canvas 1268×440 (≈2.9:1); editorial commission", alias=["featured", "featured_poster", "pick_of_the_week"]),
    "profile_banner": dict(tier=0, exact=(1280, 340), src="TPL profile-banner 1280×340 (canvas art; not in the creator kit)", alias=["banner_profile", "profile"], notkit=True),
    "cover":         dict(tier=0, ratio=16 / 9, src="SDK cover 16:9 (Publish: 1920×1080) — Q3", alias=[]),
    "cover_clean":   dict(tier=0, exact=(1920, 1080), src="platform answer 3: a clean no-text 16:9 cover held beside the lettered one — Q3", alias=["cover_notext", "cover_no_text"]),
    "screenshot":    dict(tier=0, media=True, src="SDK screenshots (no size set) — Q17", alias=["screenshots", "shot", "shots"]),
    "trailer":       dict(tier=0, media=True, src="SDK trailer (no size set) — Q17", alias=["video"]),
    "living_poster": dict(tier=2, code=True, src="KIT T2 scene module to living-poster/CONTRACT.md", alias=["living", "module", "poster_module", "scene_module", "living_poster_module"]),
    "voice_sheet":   dict(tier=2, src="KIT T2 voice sheet (rants, hits, the verb, yes/no lines)", alias=["voice"], text=True),
}
TIER1_SLOTS = ["poster", "poster_tall", "poster_square", "icon", "emblem", "key_still", "result_still", "seal", "pass_reward", "store_item", "marker"]
TIER2_SLOTS = ["living_poster", "share_card", "event_banner", "update", "chip64", "phone_916", "title_lockup", "voice_sheet"]

# ---- what the platform draws when a slot is empty (KIT "Tier 0", UK fallback column) ----
FALLBACK = {
    "poster": "the \"unwrapped\" plate: linen, catalogue number, title, kind",
    "poster_tall": "a crop of the plate", "poster_square": "a crop of the plate",
    "icon": "the catalogue number on a linen square", "emblem": "the catalogue number on a linen square",
    "key_still": "a centred poster crop, \"Back to <name>\"", "result_still": "a poster crop, \"You played for N minutes.\"",
    "seal": "a black square with a sun diamond", "pass_reward": "a hatched tile with the item's name",
    "store_item": "a hatched tile with the item's name", "marker": "a lilac diamond, open (next) / filled (held)",
    "share_card": "the poster (or plate) at 2:1 on the right, title on night, linen bar",
    "event_banner": "a card with words only (kicker, title, dates, Join)", "update": "a card with words only",
    "chip64": "the icon", "phone_916": "none (no surface)", "title_lockup": "Bricolage in the strip",
    "backdrop": "platform night", "backdrop_mobile": "platform night", "featured_still": "not eligible (editorial commission)",
    "profile_banner": "none defined", "cover": "none", "cover_clean": "none", "wide": "a crop of the poster", "voice_sheet": "none",
    "living_poster": "the tier-1 still (poster), else the unwrapped plate", "screenshot": "none", "trailer": "none",
}

# ---- page hooks (GP §4, KIT.REQUIRED) -> the slot that feeds each ----
PAGE_HOOKS = {"icon": "icon", "cont": "key_still", "store": "store_item", "rw": "pass_reward", "seal": "seal",
              "event": "event_banner", "update": "update", "share": "share_card", "reward": None}
PAGE_HOOKS_OPTIONAL = {"poster": "poster", "loop": None, "roster": None, "backdrop": "backdrop"}
