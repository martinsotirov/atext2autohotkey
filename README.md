# aText to AutoHotKey Converter

1. Export a `.plist` file with your hotkeys from aText
2. Run `node index.js -i <atext_file_path> -o <new_ahk_file_path` to convert your shortkeys

You can optionally use a base `.ahk` file that the new hotkeys will get appended to. Use the `-b <base_ahk_file>` option to provide a base file.
