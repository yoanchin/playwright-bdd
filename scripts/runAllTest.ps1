node test/setup.mjs
Get-ChildItem -Path "test" -Recurse -Filter "test.mjs" | ForEach-Object {
    node --test $_.FullName
}
