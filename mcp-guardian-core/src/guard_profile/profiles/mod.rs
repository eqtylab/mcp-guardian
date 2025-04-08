pub static CORE_NAMESPACE: &str = "mcp-guardian";

pub static CORE_PROFILES: &[(&str, &str)] = &[
    (
        "approve-tool-call-requests-and-responses",
        include_str!("./approve-tool-call-requests-and-responses.json"),
    ),
    (
        "approve-tool-call-requests",
        include_str!("./approve-tool-call-requests.json"),
    ),
    (
        "approve-tool-call-responses",
        include_str!("./approve-tool-call-responses.json"),
    ),
    (
        "block-get-current-time",
        include_str!("./block-get-current-time.json"),
    ),
    ("log-only", include_str!("./log-only.json")),
];
