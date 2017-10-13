/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  UIManager,
  findNodeHandle
} from 'react-native';

export default class Circular extends Component {

  static defaultProps = {
    borderColor:{normal:'rgb(74,145,253)',focus:'rgb(74,145,253)',error:'red',success:'white'},//默认边框色
    outBorderWidth:1,//默认外圆边框宽度
    outBorderRadius:15,//默认外圆圆角
    inBorderWidth:0,//默认内圆边框宽度
    inBorderRadius:10,//默认内圆圆角
    defaultState:'normal',//默认进入状态
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.defaultState == 'normal') {
    //   this.setState({...nextProps,...this.state,inSelectState:false})
    // }else {
    //   this.setState({...this.state,...nextProps})
    // }
      // this.setState({...this.state,...nextProps})
      this.forceUpdate()
  }

  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
      inSelectState:false,//内圆选中状态
    };
    this.playout = {} //父组件位置属性
    this.mlayout = {}//子组件位置
  }

  // 获取父组件位置
  _pLayout = (e) =>{
    const handle = findNodeHandle(e.target)
    UIManager.measure(handle, (x, y, w, h, px, py) => {
      this.playout = {x, y,width:w,height:h}
      }
    )
  }

  // 获取子组件位置
  _mLayout = (e) =>{
    const handle = findNodeHandle(e.target)
    UIManager.measure(handle, (x, y, w, h, px, py) => {
      this.mlayout = {x, y,width:w,height:h}
      }
    )
  }

  // 设置选中
  setSelect = (state) =>{
    this.setState({inSelectState:state})
  }

  // 获取坐标位置
  getPosData = () =>{
    const {outBorderRadius} = this.props
    return {...this.playout,
      x:this.playout.x+this.mlayout.x+outBorderRadius,
      y:this.playout.y+this.mlayout.y+outBorderRadius
    }
  }

  // 效验坐标位置
  assetsPos = (x,y) =>{
    const {outBorderRadius} = this.props
    if (
      x>this.playout.x+this.mlayout.x&&x<=this.playout.x+outBorderRadius*2-this.mlayout.x&&
      y>this.playout.y+this.mlayout.y&&y<=this.playout.y+outBorderRadius*2-this.mlayout.y
    ){
      return true
    }else {
      return false
    }
  }

  clear = () =>{
    this.setState({defaultState:'normal',inSelectState:false})
  }

  render() {
    const
    {
      outBorderWidth,outBorderRadius,
      inBorderWidth,inBorderRadius,
      borderColor,
      width,height
    } = this.props
      const color = borderColor[this.props.defaultState]
      return (
        <View
          onLayout={this._pLayout}
          style={{width:width/3,height:height/3,justifyContent:'center',alignItems:'center'}}>
          <View style={{
            width:outBorderRadius*2,
            height:outBorderRadius*2,
            borderRadius:outBorderRadius,
            borderWidth:outBorderWidth,
            borderColor:color,
            justifyContent:'center',alignItems:'center'
          }}
          onLayout={this._mLayout}
          >
          {this.state.inSelectState?
            <View style={{
              width:inBorderRadius*2,
              height:inBorderRadius*2,
              borderRadius:inBorderRadius,
              borderWidth:inBorderWidth,
              backgroundColor:color,
            }}></View>
            :null
          }
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({

});
