#!/bin/bash

# for entry in "../../audio"/*
# do
#   echo "$entry"
# done

arr=$(ls /Users/poweitsao/Desktop/ListenReddit/audio/combinedTest2)

# iterate through array using a counter

cd /Users/poweitsao/Desktop/ListenReddit/audio/combinedTest2

# cat empty.mp3 post1-0.mp3 >> bashCombine.mp3

files=""

for f in "${arr[@]}"; do
#    cat bashCombine.mp3 "$f" >> bashCombine.mp3 &
    # echo "$f"
    files+="$f "
# echo ${files}
done
cat ${files}>> bashCombine.mp3
