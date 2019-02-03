#!/usr/bin/env bash

main(){
    printStart
    IFS=$'\n' read -d '' -ra values < <(awk -F\" 'NF>=3 {print $4}' package.json)
    publish ${values[0]} ${values[2]} "Planet 221B"
}

publish(){
    echo
    echo >&2 "Uploading build : $1-v$2"
    echo >&2 "Notes : $3"
    zip -r "$1-v$2.zip" "dist"
    curl -X POST https://graph-video.facebook.com/appIdNumbers/assets -F "access_token=<access-token>" -F "type=BUNDLE" -F "asset=@./$1-v$2.zip" -F "comment=$3"
    rm "$1-v$2.zip"
    rm -rf dist
    echo
    printEnd
}

printStart () {
    echo -n "========= Publish Start ========="
    echo
}

printEnd () {
    echo -n "========= Publish End ========="
    echo
}

main
