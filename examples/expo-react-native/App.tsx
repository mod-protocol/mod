import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

import "./global.css";
import { Creation } from "./src/creation";
import { Cast } from "./src/cast";

export default function App() {
  return (
    <View style={styles.container}>
      <RenderCreation />
      <RenderCasts />
    </View>
  );
}

function RenderCreation() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View className="px-4 pt-4">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Creation onClose={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>New Post</Text>
      </Pressable>
    </View>
  );
}

function RenderCasts() {
  return (
    <ScrollView className="py-4 border-b border-slate-200">
      <Cast
        cast={{
          avatar_url:
            "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_144/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
          display_name: "David Furlong",
          username: "df",
          timestamp: "2023-08-17 09:16:52.293739",
          text: "[Automated] @df just starred the repo 0xOlias/ponder on Github",
          embeds: [
            {
              type: "url",
              openGraph: {
                url: "https://www.github.com/0xOlias/ponder",
                image:
                  "https://opengraph.githubassets.com/dc3ad0a62f7156e3e055d38d5fe752540c446797089d9cc82467304244c028f3/0xOlias/ponder",
                title:
                  "0xOlias/ponder: A framework for blockchain application backends",
                domain: "github.com",
              },
            },
          ],
        }}
      />
      <Cast
        cast={{
          avatar_url:
            "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_144/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
          display_name: "David Furlong",
          username: "df",
          timestamp: "2023-08-17 09:16:52.293739",
          text: "[Automated] @df just starred the repo 0xOlias/ponder on Github",
          embeds: [
            {
              type: "image",
              url: "https://opengraph.githubassets.com/dc3ad0a62f7156e3e055d38d5fe752540c446797089d9cc82467304244c028f3/0xOlias/ponder",
              sourceUrl:
                "https://opengraph.githubassets.com/dc3ad0a62f7156e3e055d38d5fe752540c446797089d9cc82467304244c028f3/0xOlias/ponder",
              alt: "Github",
            },
          ],
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // flexGrow: 1,
    // flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    // alignSelf: "stretch",
  },
  modalView: {
    marginHorizontal: 40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  container: {
    flex: 1,
    marginTop: 50,
    flexGrow: 1,
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "stretch",
    alignSelf: "stretch",
    // justifyContent: "stretch",
  },
});
