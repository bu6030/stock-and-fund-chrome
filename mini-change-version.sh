#!/bin/bash
echo ========开始========
CURRENT_V=$(echo $line | grep '"version' ./stock-and-fund-mini/manifest.json | awk '{split($0,a,"\""); print a[4]}')
echo ========当前版本$CURRENT_V========
CURRENT_REL=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[1]}')
CURRENT_INCR=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[2]}')
CURRENT_MINOR=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[3]}')
CURRENT_FIX=$(echo "$CURRENT_V" | awk '{split($0,a,"."); print a[4]}')
NEW_FIX=$(($CURRENT_FIX+1))
if [ $NEW_FIX -ge 10 ]; then
  NEW_FIX=0
  if [ $(($CURRENT_MINOR+1)) -ge 10 ]; then
    CURRENT_MINOR=0
    if [ $(($CURRENT_INCR+1)) -ge 10 ]; then
      CURRENT_INCR=0
      CURRENT_REL=$(($CURRENT_REL+1))
    else
      CURRENT_INCR=$(($CURRENT_INCR+1))
    fi
  else
    CURRENT_MINOR=$(($CURRENT_MINOR+1))
  fi
fi

NEW_V=$CURRENT_REL.$CURRENT_INCR.$CURRENT_MINOR.$NEW_FIX
echo ========新版本$NEW_V========
echo ========替换文件========
sed -i "" 's/'$CURRENT_V'/'$NEW_V'/g' ./stock-and-fund-mini/manifest.json
sed -i "" 's/'$CURRENT_V'/'$NEW_V'/g' ./stock-and-fund-mini/manifest-firefox.json
sed -i "" 's/'$CURRENT_V'/'$NEW_V'/g' ./stock-and-fund-mini/popup.html

echo ========GIT 提交文件========
git add ./stock-and-fund-mini/manifest.json
git add ./stock-and-fund-mini/manifest-firefox.json
git add ./stock-and-fund-mini/popup.html
git commit -m "修改版本号"$NEW_V
git push

echo ========完成========