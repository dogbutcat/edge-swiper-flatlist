# Edge Swiper FlatList

logic support react native >= 0.44, tested on react native >= 0.51

## Screen Shot

![screen shot](./docs/example.gif)

## Installation

----

```sh
npm install git+https://github.com/dogbutcat/edge-swiper-flatlist.git --save-dev
```

## Example

----

example code in [example folder](./example).

```javascript
import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from "react-native";

import { EdgeSwiperFlatList as FlatlistSwiper } from "edge-swiper-flatlist";

// replace link if not work
const autoPlayImage = [
    "https://pub-static.haozhaopian.net/static/web/site/features/cn/crop/images/crop_20a7dc7fbd29d679b456fa0f77bd9525d.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/da/Internet2.jpg",
    "https://ps.w.org/ssl-insecure-content-fixer/assets/banner-772x250.png?rev=1363964"
];
const { width } = Dimensions.get("window");

export default class App extends Component {
    createPlayItem(item) {
        let obj = item.item,
            index = item.index,
            itemWidth = Math.floor(width - 30);
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                key={index}
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                    //Click item
                    console.warn("pressed item");
                }}
            >
                <View
                    style={{
                        borderRadius: 8,
                        backgroundColor: "#f2f2f2",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    <Image
                        resizeMode={"cover"}
                        style={{
                            borderRadius: 8,
                            width: "100%",
                            height: "100%"
                        }}
                        // defaultSource={require('../../image/place_hold.png')}
                        source={{ uri: obj }}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        // just test with iphoneX
        // setting margin top 44 first
        // Custom setting swiper flatlist
        let CustomFlatlistSwiper = FlatlistSwiper.createFlatList({
            cardGap: 10,
            listWidth: 340,
            borderRemain: 10
        })(FlatlistSwiper);
        return (
            <View style={{ flex: 1, marginTop: 44, backgroundColor: "cyan" }}>
                <View style={{ width: "100%", height: 300 }}>
                    <CustomFlatlistSwiper
                        dataSource={autoPlayImage}
                        autoplay
                        autoplayDelay={2}
                        rowView={item => {
                            return this.createPlayItem(item);
                        }}
                    />
                </View>
                <View style={{ width: "100%", height: 250 }}>
                    <FlatlistSwiper
                        dataSource={autoPlayImage}
                        rowView={item => {
                            return this.createPlayItem(item);
                        }}
                    />
                </View>
            </View>
        );
    }
}
```

## Props

----

|props|default|type|descriptioin|
|:-|:-:|:-:|:-|
|dataSource| - |`array`| data source for the list |
|autoplay|`false`|`bool`| list should p|
|autoplayDelay|`2`|`number`| time delay of each scroll, only work while `autoplay` is `true`|
|reverse|`false`|`bool`| scroll direction from right to left|
|emptyView|-|`func`|empty view, without data|
|rowView| `React.Element`|`func(item)`|render each item to list|
|options|see below|`object`|extra option for component|

### options

|property|default|type|descriptioin|
|:-|:-:|:-:|:-|
|listWidth|_Device width_|`number`|swiper list width|
|borderRemain|7.5|`number`|remain edge to display|
|cardGap|7.5|`number`|item separator width|
|speedOffset| 34.5|`number`|when absolute swipe acceleration quickly enough (1.5), add extra offset to total offset|

more property can found in react-native `FlatList`.

## API

----

### `create(options)`

Example:

```javascript
class SomeReactComponent extends React.Component {};

var CustomEdgeSwiperFlatList = EdgeSwiperFlatList.createFlatList(options)(SomeReactComponent);
```

> this api current is working same with `props.options`, it's preset.
