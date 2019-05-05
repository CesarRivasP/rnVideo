import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Fragment,
  Text,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video'
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import WavesVideo from '../assets/media/waves.mp4';


const secondsToTime = (time) => {
  return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

class AppLayout extends Component {

  state = {
    paused: false,
    progress: 0,
    duration: 0
  };

  handleMainButtonTouch = () => {
    if(this.state.progress >= 1){
      this.player.seek(0);
    }

    this.setState(state => {
      return {
        paused: !state.paused
      }
    })
  }

  handleProgressPress = (e) => {
    const position = e.nativeEvent.locationX;
    const progress = (position / 250) * this.state.duration;
    this.player.seek(progress);
  }

  handleProgress = (progress) => {
    this.setState({
      progress: progress.currentTime / this.state.duration
    })
  }

  handleEnd = () => {
    this.setState({
      paused: true
    })
  }


  handleLoad = (meta) => {
    this.setState({
      duration: meta.duration
    });
  }

  render () {
    const { width } = Dimensions.get('window');
    const { height } = width * .5625;
    return (
      <React.Fragment>
        <View>
          <Video
            paused={this.state.paused}
            // onLayout={this.handleVideoLayout}
            // repeat
            // style={{ width: '100%', height }}
            style={{ width, height: 300 }}
            source={WavesVideo} // en caso de tener un video local
            // source={{uri:"https://player.vimeo.com/external/2072777102.hd.mp4?s=6939b93ae3554679b57f5e7fa831eef712a74b3c&profile_id=119&oauth2_token_id=57447761"}}
            resizeMode="contain"
            onLoad={this.handleLoad}
            onProgress={this.handleProgress}
            onEnd={this.handleEnd}
            ref={(ref) => this.player = ref}
            // style={StyleSheet.absoluteFill}
            // onError={this.handleError}
            // onLoadStart={this.handleLoadStart}
            // onBuffer={this.handleBuffer}
          />
          <View style={styles.controls}>
            <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
              <Icon name={!this.state.paused ? "pause" : "play" } size={30} color="#FFF" />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.handleProgressPress}>
              <View>
                <ProgressBar
                  progress={this.state.progress}
                  color="#FFF"
                  unfilledColor="rgba(255 , 255, 255, .5)"
                  borderColor="#FFF"
                  width={250}
                  height={20}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.duration}>
              {secondsToTime(Math.floor(this.state.progress * this.state.duration))}
            </Text>
          </View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 48,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10
  },
  mainButton: {
    marginRight: 15
  },
  duration: {
    color: '#FFF',
    marginLeft: 15
  }
})

export default AppLayout;
