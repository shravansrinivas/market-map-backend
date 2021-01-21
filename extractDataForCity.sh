#!/bin/bash

set -ev 

CITYNAME=$1

# check if an element exists in link
function list_include_item {
  local list="$1"
  local item="$2"
  if [[ $list =~ (^|[[:space:]])"$item"($|[[:space:]]) ]] ; then
    # yes, list include item
    result=0
  else
    result=1
  fi
  return $result
}


function extractForBigCity {
declare -A bigCities
bigCities['Agra']=4
bigCities['Mathura']=2
bigCities['Allahabad']=2
bigCities['Lucknow']=3
bigCities['Patna']=6
bigCities['Ranchi']=5
bigCities['Hyderabad']=10

for ITERATION in $( eval echo {0..${bigCities[${CITYNAME}]}} )
do
    for NUMBER in {0..12}
    do
	    node citiesToLookup.js $CITYNAME shops $NUMBER $ITERATION
        sleep 25
    done
    for NUMBER in {0..25}
    do
	    node citiesToLookup.js $CITYNAME brands $NUMBER $ITERATION
        sleep 25
    done
    
done
}

function extractRegularCity {
for NUMBER in {0..12}
do
	node citiesToLookup.js $CITYNAME shops $NUMBER
    sleep 25
done
for NUMBER in {0..25}
do
	node citiesToLookup.js $CITYNAME brands $NUMBER
    sleep 25
done
}


function extract {

`list_include_item "Mathura Allahabad Agra Lucknow Patna Ranchi Hyderabad" "$CITYNAME"`  && bigcity=1 || bigcity=0
if [ $bigcity == 0 ]
then
      extractRegularCity
else
      extractForBigCity
fi

}

if [ -z "$CITYNAME" ]
then
 echo enter valid cityname argument
else
 echo "starting extraction for ${CITYNAME}"
 extract
fi