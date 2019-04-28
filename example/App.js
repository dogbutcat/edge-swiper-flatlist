/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from "react-native";

import { EdgeSwiperFlatList as FlatlistSwiper } from "edge-swiper-flatlist";

const instructions = Platform.select({
    ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    android:
        "Double tap R on your keyboard to reload,\n" +
        "Shake or press menu button for dev menu"
});

type Props = {};

const autoPlayImage = [
    "https://pub-static.haozhaopian.net/static/web/site/features/cn/crop/images/crop_20a7dc7fbd29d679b456fa0f77bd9525d.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/da/Internet2.jpg",
    "https://ps.w.org/ssl-insecure-content-fixer/assets/banner-772x250.png?rev=1363964"
];
const autoPlayLocalImage = [
    "./assets/1.png",
    "./assets/2.png",
    "./assets/3.png"
];
const { width } = Dimensions.get("window");

export default class App extends Component<Props> {
    createPlayItem(item) {
        let obj = item.item,
            index = item.index,
            itemWidth = Math.floor(width - 30);
        // let uri =
        // 	obj.banner_url +
        // 	"?imageView2/1/w/" +
        // 	itemWidth * 2 +
        // 	"/h/" +
        // 	Math.floor(this.swiperHeight * 2);
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                key={index}
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                    //点击事件
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
                        // source={require(obj)}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    createPlayLocalItem(item) {
        let obj = item.item,
            index = item.index,
            itemWidth = Math.floor(width - 30);
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                key={index}
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                    //点击事件
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
                        defaultSource={require("./assets/1.png")}
                        // source={{ uri: obj }}
                        // source={require(obj)}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        // return (
        //   <View style={styles.container}>
        //     <Text style={styles.welcome}>Welcome to React Native!</Text>
        //     <Text style={styles.instructions}>To get started, edit App.js</Text>
        //     <Text style={styles.instructions}>{instructions}</Text>
        //   </View>
        // );

        // just test with iphoneX
        // setting margin top 44 first
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
                        dataSource={autoPlayLocalImage}
                        // autoplay
                        // autoplayDelay={6}
                        rowView={item => {
                            return this.createPlayLocalItem(item);
                        }}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ textAlign: "center" }}>Reference Code</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});
