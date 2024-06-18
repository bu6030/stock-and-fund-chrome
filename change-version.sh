#!/bin/bash
echo ========开始========
CURRENT_V=$(echo $line | grep '"version' ./stock-and-fund/manifest.json | awk '{split($0,a,"\""); print a[4]}')
echo ========当前版本$CURRENT_V========
CURRENT_REL=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[1]}')
CURRENT_INCR=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[2]}')
CURRENT_MINOR=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[3]}')
CURRENT_FIX=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[4]}')
NEW_FIX=$(($CURRENT_FIX+1))
NEW_V=$CURRENT_REL.$CURRENT_INCR.$CURRENT_MINOR.$NEW_FIX
echo ========新版本$NEW_V========
echo ========替换文件========
sed -i "" 's/'$CURRENT_V'/'$NEW_V'/g' ./stock-and-fund/manifest.json
sed -i "" 's/'$CURRENT_V'/'$NEW_V'/g' ./stock-and-fund/manifest-firefox.json
sed -i "" 's/'$CURRENT_V'/'$NEW_V'/g' ./stock-and-fund/popup.html
sed -i "" 's/'$CURRENT_V'/'$NEW_V'/g' ./stock-and-fund/full-screen.html

echo ========GIT 提交文件========
git add ./stock-and-fund/manifest.json
git add ./stock-and-fund/manifest-firefox.json
git add ./stock-and-fund/popup.html
git add ./stock-and-fund/full-screen.html
git commit -m "修改版本号"$NEW_V
git push

echo ========完成========