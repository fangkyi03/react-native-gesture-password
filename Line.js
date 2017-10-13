/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {getTransform,isEquals} from './util';

export default class Line extends Component {

  static defaultProps = {
    borderColor:{focus:'rgb(74,145,253)',error:'red',success:'white'},//默认边框色
    defaultState:'normal',//默认进入状态
    lineWidth:1,//线条宽度
  }

  constructor(props) {
    super(props);
    this.state = this.props;
  }

  setNativeProps(props) {
    this.setState(props);
  }

  clear = () =>{
    this.setState({start:{},end:{}})
  }

  render() {
    let { start, end } = this.state;
    if ( isEquals(start, end) ) return null;
    if (this.props.defaultState !=='normal') {
      let lineColor = this.props.borderColor[this.props.defaultState]
      let transform = getTransform(start, end);
      let length = transform.d;
      let angle = transform.a + 'rad';
      let moveX = transform.x;
      let moveY = transform.y;
      return (
        <View
          style={[
            styles.line, {backgroundColor: lineColor, left: start.x, top: start.y, width: length},
            {transform: [{translateX: moveX}, {translateY: moveY}, {rotateZ: angle}]}
        ]} />
      );
    }else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  line: {
      position: 'absolute',
      height: 1
  }
});
