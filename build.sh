#!/usr/bin/bash



if [ ! -d ./build ]; then
	mkdir ./build
else
	rm -r ./build/*
fi

mkdir ./build/icons
mkdir ./build/Calc-JS

cp ./manifest.json ./build
cp -r ./background ./build
cp -r ./popup ./build
cp -r ./icons/*.png ./build/icons
cp -r ./Calc-JS/src ./build/Calc-JS
