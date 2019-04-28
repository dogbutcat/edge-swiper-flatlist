import React, { Component, PureComponent } from "react";
import {
    Image,
    StyleSheet,
    View,
    FlatList, //Replace ListView with FlatList
    ActivityIndicator,
    TouchableOpacity,
    Platform,
    Dimensions
} from "react-native";

// let n = 0;

export default class EdgeSwipeFlatlist extends PureComponent {
    static defaultProps = {
        startIndex: 0,
        vertical: false,
        autoplay: false,
        autoplayDelay: 2, // unit in seconds
        // autoplayLoop: true,
        reverse: false,
        waitingView: () => {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            );
        },
        emptyView: () => {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            );
        },
        rowView: item => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        item.item.click();
                    }}
                >
                    <Image
                        source={{ uri: item.item.uri }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode={"contain"}
                    />
                </TouchableOpacity>
            );
        },
        options: {
            listWidth: Dimensions.get("window").width,
            borderRemain: 7.5,
            cardGap: 7.5,
            speedOffset: (Dimensions.get("window").width - 7.5 - 7.5) / 10,
            sliceCount: 1
        }
    };
    /**
     *
     * @param {{listWidth:number,borderRemain:number,cardGap:number,speedOffset:number,sliceCount:number}} options
     */
    static createFlatList(options) {
        options = options || {};
        return Component => props => {
            return <Component {...props} options={options} />;
        };
    }

    constructor(props) {
        super(props);
        this.initParams(props.options);
        // this.fetchMore = this._fetchMore.bind(this);
        this.fetchData = this._fetchData.bind(this);
        this.state = {
            isLoading: true,
            // isLoadingMore: false,
            // renderType: RENDER_TYPE.DEFAULT,
            paginationIndex: props.startIndex,
            _pageNum: 0,
            _data: null
        };
    }

    initParams(options) {
        this.width = options.listWidth || Dimensions.get("window").width;
        // height = Dimensions.get('window').height;
        this.BORDER_REMAIN = options.borderRemain || 7.5; // single item distance to screen [left or right] edge
        this.CARD_GAP = options.cardGap || 7.5;
        this.CARD_WIDTH = this.width - 2 * (this.BORDER_REMAIN + this.CARD_GAP); // sigle item width
        this.SCROLL_OFFSET = this.CARD_WIDTH + this.CARD_GAP;
        this.SPEED_OFFSET = options.speedOffset || this.CARD_WIDTH / 10;
        this.SLICE_COUNT = options.sliceCount || 1; // item count to append
    }

    componentWillReceiveProps(nextProps) {
        if (
            JSON.stringify(nextProps.dataSource) !==
            JSON.stringify(this.props.dataSource)
        ) {
            this.updateData(nextProps.dataSource);
        }
    }

    // default set for fetch new data
    _fetchData(callback) {
        // main fetch method
        this.props.onFetch && this.props.onFetch(this.state._pageNum, callback);
    }

    // _onScrollToIndexFailed = info => {
    // 	setTimeout(() => this._scrollToIndex(info.index, false));
    // };

    _scrollToIndex = (index, animated) => {
        const params = { animated, offset: index * this.SCROLL_OFFSET };
        // console.log(params);
        // this.setState(() => {

        // 	return { paginationIndex: index };
        // });
        if (this._flatList) {
            // this._flatList.scrollToIndex(params);
            setTimeout(() => {
                this._flatList.scrollToOffset(params);
                // console.log("NATIVE: ", params, "n: ", +new Date());
            }, 1);
        }
    };

    _onScrollEndDrag = e => {
        // this._flatList.scrollEnabled = false;
        const { autoplay, vertical, scrollDragEnd } = this.props;
        const { contentOffset, layoutMeasurement, velocity } = e.nativeEvent;
        let index;
        if (vertical) {
            index = Math.floor(contentOffset.y / layoutMeasurement.height);
        } else {
            // Divide the horizontal offset by the width of the view to see which page is visible
            // index = Math.floor(contentOffset.x / layoutMeasurement.width);
            let velocityOffset =
                Math.abs(velocity.x) > 1.5 ? this.SPEED_OFFSET : 0; // speed up offset
            if (
                this._startOffset + this.SPEED_OFFSET + velocityOffset <
                contentOffset.x
            )
                index = Math.floor(
                    (contentOffset.x + this.SCROLL_OFFSET) / this.SCROLL_OFFSET
                );
            else if (this._startOffset - this.SPEED_OFFSET > contentOffset.x) {
                index = Math.ceil(
                    (contentOffset.x - this.SCROLL_OFFSET - velocityOffset) /
                        this.SCROLL_OFFSET
                );
            } else {
                index = Math.floor(
                    (contentOffset.x + this.SCROLL_OFFSET / 2) /
                        this.SCROLL_OFFSET
                );
            }
        }
        // console.log("content", contentOffset, "index", index);

        // this.setState({ paginationIndex: index }, () => {
        this._scrollToIndex(index, true);
        if (autoplay) {
            setTimeout(
                () => {
                    this._autoplay(index);
                },
                Platform.select({
                    ios: 0,
                    android: 50
                }) // for android need to stuck serveral interval for internal reaction
            );
        } else {
            this.updateIdx(index);
        }
        // });

        if (scrollDragEnd) {
            scrollDragEnd(e);
        }
    };

    /**
     * index: current display index
     */
    _autoplay = index => {
        const { autoplayDelay, startIndex, reverse } = this.props;
        let nextIndex = !reverse ? index + 1 : index - 1;
        this._clearAutoplayTimer();
        if (index >= this.headIndex && index <= this.endIndex) {
            // index inside range, go normal
            // console.log("stay going", nextIndex);
            this.autoplayTimer = setTimeout(() => {
                this._scrollToIndex(nextIndex, true);
                setTimeout(() => {
                    this._autoplay(nextIndex);
                }, 200);
            }, autoplayDelay * 1000);
        }
        // replace by this
        this.updateIdx(index, nextIdx => {
            this.autoplayTimer = setTimeout(() => {
                this._autoplay(nextIdx);
            }, 200);
        });
        // if (index < this.headIndex) {
        //     // indicates current stay outside range
        //     // console.log("before head");
        //     Platform.select({
        //         android: () => {
        //             this._scrollToIndex(nextIndex, true);
        //         }
        //     });
        //     this.autoplayTimer = setTimeout(() => {
        //         this._scrollToIndex(this.endIndex, false);
        //         this.autoplayTimer = setTimeout(() => {
        //             this._autoplay(this.endIndex);
        //         }, 200);
        //     }, 200);
        // } else if (index > this.endIndex) {
        //     // next page goes outside endIndex
        //     // console.log("over end now ", index);
        //     // if android platform need to scroll one more time to prevent stuck
        //     Platform.select({
        //         android: () => {
        //             this._scrollToIndex(nextIndex, true);
        //         }
        //     });
        //     this.autoplayTimer = setTimeout(() => {
        //         this._scrollToIndex(this.headIndex, false);
        //         // console.log('NATIVE: ', this.headIndex);
        //         this.autoplayTimer = setTimeout(() => {
        //             this._autoplay(this.headIndex);
        //         }, 200);
        //     }, 200);
        // }
    };

    _clearAutoplayTimer() {
        if (this.autoplayTimer) {
            clearTimeout(this.autoplayTimer);
        }
    }

    updateIdx(currentIdx, cb) {
        const { reverse } = this.props;
        let nextIndex = !reverse ? currentIdx + 1 : currentIdx - 1;
        if (currentIdx < this.headIndex) {
            // indicates current stay outside range
            Platform.select({
                android: () => {
                    this._scrollToIndex(nextIndex, true);
                }
            });
            setTimeout(() => {
                this._scrollToIndex(this.endIndex, false);
                cb && cb(this.endIndex);
            }, 200);
        } else if (currentIdx > this.endIndex) {
            // next page goes outside endIndex
            // console.log("over end now ", index);
            // if android platform need to scroll one more time to prevent stuck
            Platform.select({
                android: () => {
                    this._scrollToIndex(nextIndex, true);
                }
            });
            setTimeout(() => {
                this._scrollToIndex(this.headIndex, false);
                cb && cb(this.headIndex);
            }, 200);
        }
    }

    updateData(data) {
        let endData = data.slice(-this.SLICE_COUNT),
            startData = data.slice(0, this.SLICE_COUNT);
        let newData =
            (this.SLICE_COUNT &&
                data.length != 1 &&
                endData.concat(data, startData)) ||
            endData;
        this.setState(
            {
                _data: newData,
                isLoading: false
                // _pageNum: this.state._pageNum + 1,
                // renderType: RENDER_TYPE.DEFAULT
            },
            () => {
                const { autoplay, startIndex, reverse } = this.props;
                // (!reverse &&
                // 	((this.headIndex = 1),
                // 	(this.endIndex = this.state._data.length - 2))) ||
                // 	((this.endIndex = 1), (this.headIndex = this.state._data.length - 2));
                (this.headIndex = 1),
                    (this.endIndex = this.state._data.length - 2);
                let newIndex =
                    (!reverse && startIndex + this.SLICE_COUNT) ||
                    newData.length - 1 - this.SLICE_COUNT;
                if (newIndex !== 0) {
                    this._scrollToIndex(newIndex, false);
                }
                if (autoplay) {
                    this._autoplay(newIndex);
                }
            }
        );
    }

    componentDidMount() {
        let data = this.props.dataSource;
        this.updateData(data);
    }

    // edge view to meet same
    getEdgeView() {
        return (
            <View
                style={{
                    width: this.BORDER_REMAIN + this.CARD_GAP,
                    backgroundColor: "transparent"
                }}
            />
        );
    }

    getSeperateView() {
        return <View style={{ width: this.CARD_GAP }} />;
    }

    componentWillUnmount() {
        this._clearAutoplayTimer();
    }

    render() {
        const { vertical, waitingView, emptyView, rowView } = this.props;
        if (this.state.isLoading) {
            return waitingView();
        } else {
            return (
                <FlatList
                    ref={a => {
                        this._flatList = a;
                    }}
                    style={{ width: this.width }}
                    // pagingEnabled={true} // paging
                    keyExtractor={(item, index) => "item-" + index}
                    getItemLayout={(data, index) => ({
                        length: this.CARD_WIDTH,
                        offset: this.SCROLL_OFFSET * index,
                        index
                    })}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onScrollBeginDrag={e => {
                        if (!vertical) {
                            this._startOffset = e.nativeEvent.contentOffset.x;
                        }
                        this._clearAutoplayTimer();
                    }}
                    onScrollEndDrag={this._onScrollEndDrag}
                    ListHeaderComponent={() => {
                        return this.getEdgeView();
                    }}
                    ListEmptyComponent={() => {
                        return emptyView();
                    }}
                    ListFooterComponent={() => {
                        return this.getEdgeView();
                    }}
                    ItemSeparatorComponent={() => {
                        return this.getSeperateView();
                    }}
                    horizontal={!vertical}
                    onEndReachedThreshold={0.1}
                    data={this.state._data}
                    renderItem={item => {
                        return (
                            <View
                                style={{
                                    ...styles.listItem,
                                    width: this.CARD_WIDTH
                                }}
                            >
                                {rowView(item)}
                            </View>
                        );
                    }}
                    bounces={false}
                    // debug={__DEV__}
                    // windowSize={5}
                    {...this.props}
                />
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 25,
        backgroundColor: "transparent"
    },
    listItem: {
        backgroundColor: "transparent"
        // borderColor: "blue",
        // borderRadius: 10,
        // borderWidth: 1
    }
});
