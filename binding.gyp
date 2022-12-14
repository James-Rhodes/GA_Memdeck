{
    "targets": [
        {
            "target_name": "ga",
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "sources": [
                "./cppsrc/node_addon.cpp",
                "./cppsrc/ga_src/CardShuffles.cpp",
                "./cppsrc/ga_src/Deck.cpp",
                "./cppsrc/ga_src/GA.cpp",
                "./cppsrc/ga_src/RandNumGen.cpp",
                "./cppsrc/ga_src/customShuffle.cpp"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS'],
        }
    ]
}
