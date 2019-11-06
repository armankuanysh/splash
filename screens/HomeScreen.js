import * as WebBrowser from "expo-web-browser";
import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator
} from "react-native";

import { MonoText } from "../components/StyledText";

const API_KEY =
  "72081d9fa9a55383532f93390f3f3c83b8cb7c46eb92d278c06ba937539a3aaa";

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pops: undefined,
      modalUp: false,
      page: 1,
      loadingMore: false,
      loading: false
    };
  }

  fetching = () => {
    fetch(
      `https://api.unsplash.com/photos/?page=${this.state.page}&client_id=${API_KEY}`,
      {
        mode: "GET"
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log("🐞: HomeScreen -> fetching -> res", res);
        this.setState({
          data: this.state.page === 1 ? res : [...this.state.data, ...res],
          loading: true
        });
      });
  };

  fetchMore = () => {
    this.setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
        loadingMore: true
      }),
      () => {
        this.fetching();
      }
    );
  };

  componentDidMount() {
    this.fetching();
  }
  componentDidUpdate() {
    // this.state.modalUp
    console.log(
      "🐞: componentDidUpdate -> this.state.modalUp",
      this.state.modalUp
    );
  }

  _renderFooter = () => {
    if (!this.state.loadingMore) return null;

    return (
      <View
        style={{
          position: "relative",
          width: "100%",
          height: 60,
          paddingVertical: 20,
          marginTop: 10,
          marginBottom: 10
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    const { data, pops, modalUp } = this.state;
    if (!data) return null;
    return (
      <View style={styles.container}>
        {modalUp && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,.75 )",
              top: 0,
              left: 0,
              zIndex: 1000
            }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 50,
                right: 10,
                width: 30,
                height: 30
              }}
              onPress={() => {
                this.setState({ modalUp: false });
              }}>
              <Ionicons
                name="ios-close"
                size={40}
                style={{ marginBottom: -3 }}
                color="#fff"
              />
            </TouchableOpacity>
            {pops.urls.regular ? (
              <Image
                style={{ width: "100%", height: "60%", resizeMode: "contain" }}
                source={{ uri: pops.urls.regular }}
              />
            ) : (
              <ActivityIndicator size="large" color="#ccc" />
            )}
            <Text style={{ color: "#fff" }}>{pops.alt_description}</Text>
          </View>
        )}
        <View
          style={{
            width: "100%",
            height: 80,
            paddingTop: 20,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Image
            style={{ width: 158, height: 25, resizeMode: "contain" }}
            source={require("../assets/images/logo.png")}
          />
        </View>
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={data}
          horizontal={false}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.imagesContainer}
              onPress={() => {
                this.setState({ pops: item, modalUp: true });
              }}>
              <Image
                style={{ width: 160, height: 160 }}
                source={{ uri: item.urls.thumb }}
              />
            </TouchableOpacity>
          )}
          ListFooterComponent={this._renderFooter}
          onEndReached={this.fetchMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
        />
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 15,
    alignItems: "center"
  },
  imagesContainer: {
    marginHorizontal: 5,
    marginBottom: 10
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
