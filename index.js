/* @flow */
/*
  title  手势密码主体
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  UIManager,
  findNodeHandle,
  PanResponder
} from 'react-native';

// 载入组件
import Circular from './Circular';
import Line from './Line';


export default class GesturePassword extends Component {

  static defaultProps = {
    width: 600,
    height:600,
    offsetY:64,//默认Y轴偏移
    offsetX:0,//默认X轴偏移
  }

  constructor(props) {
    super(props);
    this.playout = {}//父组件位置属性
    this.mlayout = {}//子组件位置属性
    this.isMoving = false//是否移动
    this.selectPos = 0//当前选中目标
    this.selectList = []//当前选中列表
    this.state = {
      ...this.props,
      lineList:[]
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...this.state,...nextProps})
  }

  // 转换坐标
  tranXY = (event) =>{
    let x,y
    // console.log('输出父子位置',this.playout,this.mlayout);
    x = event.nativeEvent.pageX - this.mlayout.x - this.props.offsetX
    y = event.nativeEvent.pageY - this.mlayout.y - this.props.offsetY
    return {x,y}
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onStartShouldSetPanResponderCapture: (event, gestureState) => true,
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

            // 开始手势操作
            onPanResponderGrant: (event, gestureState) => {
              this.props.onStart&&this.props.onStart()
              this.onStart(this.tranXY(event));
            },
            // 移动操作
            onPanResponderMove: (event, gestureState) => {
              this.onMove(this.tranXY(event));
            },
            // 释放手势
            onPanResponderRelease: (event, gestureState) => {
              this.onEnd(this.tranXY(event));
            }
        })
  }

  // 效验坐标
  assetsPos = (x,y) =>{
    for (var i = 0; i < 9; i++) {
      if (this.refs['cirular'+i].assetsPos(x,y)&&this.selectList.indexOf(i)==-1) {
        this.refs['cirular'+i].setSelect(true)
        let x1 = 0 ,y1 = 0,x2 = 0 ,y2 = 0
        x1 = this.selectPos&&this.selectPos.getPosData().x
        y1 = this.selectPos&&this.selectPos.getPosData().y
        x2 = this.refs['cirular'+i].getPosData().x
        y2 = this.refs['cirular'+i].getPosData().y
        if (this.selectPos) {
          this.state.lineList.push({start:{x:x1,y:y1},end:{x:x2,y:y2}})
        }else {
          this.state.lineList.push({start:{x:x2,y:y2},end:{x:x2,y:y2}})
        }
        this.selectPos = this.refs['cirular'+i]
        this.selectList.push(i)
        this.setState({lineList:this.state.lineList,defaultState:'focus'})
        break;
      }else {
        let x1 = 0 ,y1 = 0
        if (this.selectPos) {
          x1 = this.selectPos.getPosData().x
          y1 = this.selectPos.getPosData().y
          this.refs.line.setNativeProps({start:{x:x1,y:y1},end:{x,y}})
        }
      }
    }
  }

  // 手势开始
  onStart = ({x,y}) =>{
    this.assetsPos(x,y)
  }

  // 手势移动事件
  onMove = ({x,y}) =>{
    this.isMoving = true
    this.assetsPos(x,y)
  }

  // 手势结束事件
  onEnd = ({x,y}) =>{
    this.isMoving = false
    let pass = this.selectList.join('')
    this.refs.line.setNativeProps({start:{},end:{}})
    this.props.onEnd&&this.props.onEnd(pass)
  }

  // 渲染圆
  _renderCircu = () =>{
    return new Array(9).fill('').map((e,i)=>{
      return (
          <Circular
            ref={'cirular'+i}
            key={'_renderCircu'+i}
            {...this.state}/>
      )
    })
  }

  // 渲染横线
  _renderLine = () =>{
    return this.state.lineList.map((e,i)=>{
      return (
        <Line
          ref={'mline'+i}
          key={'_renderLine'+i}
          {...this.state} {...e}/>
      )
    })
  }

  // 获取父控件位置
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

  // 清除状态
  clear = () =>{
    this.selectList.forEach((e)=>{
      this.refs['cirular'+e].clear()
    })
    this.state.lineList.forEach((e,i)=>{
      this.refs['mline'+i].clear()
    })
    this.selectList = []
    this.selectPos = 0
    this.refs.line.setNativeProps({start:{},end:{}})
    this.setState({defaultState:'normal',lineList:[]})
  }

  render() {
    const {style,width,height} = this.state
    return (
      <View style={[styles.container,style]}
        onLayout={this._pLayout}
        {...this._panResponder.panHandlers}>
        <View
          style={[styles.centerView,{width,height}]}
          onLayout={this._mLayout}>
            {this._renderCircu()}
            {this._renderLine()}
            <Line ref={'line'} {...this.state}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerView:{
    // borderWidth: 1,
    // borderColor: 'black',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignContent: 'space-between'
  }
});
