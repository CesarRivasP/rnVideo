import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Fragment,
  Text,
  Animated,
  Dimensions,
  TextInput,
  ScrollView
} from 'react-native';
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/FontAwesome'
import WavesVideo from '../assets/media/waves.mp4';


const THRESHOLD = 100;

class AppLayout extends Component {

  state = {
    paused: true,
    error: false,
    buffering: true,
    animated: new Animated.Value(0)
  };

  position = {
    start: null,
    end: null
  };

  handleVideoLayout = (e) => {
    const { height } = Dimensions.get('window');
    this.position.start = e.nativeEvent.layout.y - height + THRESHOLD;
    this.position.end = e.nativeEvent.layout.y + e.nativeEvent.layout.height - THRESHOLD;
  };

  handleScroll = (e) => {
    const scrollPosition = e.nativeEvent.contentOffset.y;
    const paused = this.state.paused;
    const { start, end } = this.position;

    if(scrollPosition > start && scrollPosition < end && paused){
      this.setState({
        paused: false
      })
    }
    else if((scrollPosition > end || scrollPosition < start) && !paused){
      this.setState({
        paused: true
      })
    }
  };

  render () {
    const { width } = Dimensions.get('window');
    return (
      <React.Fragment>
        <ScrollView scrollEventThrottle={16} onScroll={this.handleScroll}>
          <View style={ styles.fakeContent }>
            <Text>
              { this.state.paused? "Paused" : "Playing" }
            </Text>
          </View>
          <Video
            pause={this.state.paused}
            onLayout={this.handleVideoLayout}
            repeat
            style={{ width, height: 300 }}
            source={WavesVideo} // en caso de tener un video local
            // source={{uri:"https://player.vimeo.com/external/2072777102.hd.mp4?s=6939b93ae3554679b57f5e7fa831eef712a74b3c&profile_id=119&oauth2_token_id=57447761"}}
            resizeMode="contain"
            // style={StyleSheet.absoluteFill}
            onError={this.handleError}
            onLoadStart={this.handleLoadStart}
            onBuffer={this.handleBuffer}
          />
          <View style={ styles.fakeContent }>
            <Text>
              { this.state.paused? "Paused" : "Playing" }
            </Text>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  videoCover: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // backgroundColor: "transparent"
  },
  bufferingAndError: {
    backgroundColor: "#000"
  },
  header: {
    backgroundColor: "transparent",
    fontSize: 30,
    color:'white'
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: '#FFF',
    marginVertical: 15,
    paddingLeft: 15
  },
  fakeContent: {
    height: 850,
    backgroundColor: '#CCC',
    paddingTop: 250,
    alignItems: 'center'
  }
})

export default AppLayout;
