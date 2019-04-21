import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Fragment,
  Text,
  Animated,
  Dimensions
} from 'react-native';
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/FontAwesome'
import WavesVideo from '../assets/media/waves.mp4';


class AppLayout extends Component {

  state = {
    error: false,
    buffering: true,
    animated: new Animated.Value(0)
  }

  handleError = (meta) => {
    const { error: { code } } = meta;
    let error = "An error ocurred playing this video"

    switch(code) {
      case -11800:
        error = "Could not load video from URL"
        break;
    }

    this.setState({
      error
    })
  }

  handleLoadStart = () => {
    this.triggerBufferAnimation();
  };

  triggerBufferAnimation = () => {
    this.loopingAnimation = Animated.loop(
      Animated.timing(this.state.animated, {
        toValue: 1,
        duration: 350
      })
    ).start();
  }

  handleBuffer = (meta) => {
    meta.isBuffering && this.triggerBufferAnimation();

    if(this.loopingAnimation && !meta.isBuffering) {
      this.loopingAnimation.stopAnimation();
    }

    this.setState({
      buffering: meta.isBuffering
    })
  };

  render () {
    const { width } = Dimensions.get('window');
    const height = width * 0.5625;
    const { error } = this.state;
    const { buffering } = this.state;
    const { bufferingAndError } = this.state;
    const interpolatedAnimation = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    const rotateStyle = {
      transform: [
        { rotate: interpolatedAnimation }
      ]
    }

    return (
      <React.Fragment>
          <View style={ bufferingAndError ? styles.bufferingAndError : undefined }>
            <Video
              repeat
              style={{ width: "100%", height }}
              source={WavesVideo} // en caso de tener un video local
              // source={{uri:"https://player.vimeo.com/external/2072777102.hd.mp4?s=6939b93ae3554679b57f5e7fa831eef712a74b3c&profile_id=119&oauth2_token_id=57447761"}}
              resizeMode="contain"
              // style={StyleSheet.absoluteFill}
              onError={this.handleError}
              onLoadStart={this.handleLoadStart}
              onBuffer={this.handleBuffer}
            />
            <View style={styles.videoCover}>
              {
                error ?
                  (
                    <React.Fragment>
                      <Icon name="exclamation-triangle" size={35} color="red"/>
                      <Text style={{ fontSize: 15, color: 'white' }}>{error}</Text>
                    </React.Fragment>
                  )
                  :
                  (
                    buffering &&
                      <Animated.View style={rotateStyle}>
                        <Icon name="circle-o-notch" size={30} color="#FFF" />
                      </Animated.View>
                  )
              }
            </View>
          </View>
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
  }
  // error: {
  //   backgroundColor: "#000"
  // }
})

export default AppLayout;

{/*  */}
