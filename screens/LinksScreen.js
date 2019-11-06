import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { ExpoLinksView } from "@expo/samples";

const API_KEY =
  "72081d9fa9a55383532f93390f3f3c83b8cb7c46eb92d278c06ba937539a3aaa";

export default class LinksScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pops: undefined,
      modalUp: false,
      page: 1,
      loadingMore: false,
      loading: false,
      query: "",
      noItems: false
    };
  }

  fetching = () => {
    fetch(
      `https://api.unsplash.com/search/photos/?page=${this.state.page}&query=${
        this.state.query ? this.state.query : "random"
      }&client_id=${API_KEY}`,
      {
        mode: "GET"
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log("🐞: Link -> fetching -> res", res);
        if (res.total == 0) {
          this.setState({
            noItems: true
          });
        } else {
          this.setState({
            data:
              this.state.page === 1
                ? res.results
                : [...this.state.data, ...res.results],
            loading: true,
            noItems: false
          });
        }
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

  searchIt = () => {
    this.setState(
      (prevState, nextProps) => ({
        page: 1,
        data: []
      }),
      () => {
        this.fetching();
      }
    );
  };

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
    const { data, pops, modalUp, noItems } = this.state;
    console.log("🐞: LinksScreen -> render -> data", data);
    // if (!data) return null;
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
                style={{
                  width: "100%",
                  height: "60%",
                  resizeMode: "contain"
                }}
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
            height: 60,
            backgroundColor: "#fff",
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "rgba(0,0,0,.5)"
          }}>
          <TextInput
            style={{ width: "80%", height: "100%" }}
            value={this.state.query}
            placeholder="Search..."
            onSubmitEditing={this.searchIt}
            onChangeText={it => {
              this.setState({ query: it });
            }}
          />
          <TouchableOpacity onPress={this.searchIt}>
            <Ionicons
              name="ios-search"
              size={20}
              style={{ marginBottom: -3 }}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {noItems && (
          <View
            style={{
              width: "100%",
              height: 300,
              alignItems: "center",
              paddingTop: 30
            }}>
            <Ionicons name="ios-sad" size={60} color="#ccc" />
            <Text>Sorry, there is nothing...</Text>
          </View>
        )}
        {data && !noItems ? (
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
        ) : (
          !noItems && (
            <View style={{ width: "100%", height: 500 }}>
              <ActivityIndicator size="large" color="#ccc" />
            </View>
          )
        )}
      </View>
    );
  }
}

LinksScreen.navigationOptions = {
  title: "Links"
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
  }
});
