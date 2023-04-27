import {
  PixelRatio,
  Dimensions,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';

export const screenW = Dimensions.get('window').width;
export const screenH = Dimensions.get('window').height;
const fontScale = PixelRatio.getFontScale();
export const pixelRatio = PixelRatio.get();

const r2 = 2;
const w2 = 750 / r2;
const h2 = 1334 / r2;

/**
 * 设置 text 为 sp
 */
export const DEFAULT_DENSITY = 2;
export function setSpText(size) {
  const scaleWidth = screenW / w2;
  const scaleHeight = screenH / h2;
  const scale = Math.min(scaleWidth, scaleHeight);
  size = Math.round(((size * scale + 0.5) * pixelRatio) / fontScale);
  return size;
}

/**
 * 屏幕适配，缩放 size
 * @param {*} size
 */
export function scaleSize(size) {
  const scaleWidth = screenW / w2;
  const scaleHeight = screenH / h2;
  const scale = Math.min(scaleWidth, scaleHeight);
  size = Math.round(size * scale + 0.5);
  return size / DEFAULT_DENSITY;
}

type StyleProps = Partial<ViewStyle | TextStyle | ImageStyle>;

export const CustomStyleSheet = {
  create(style: {[className: string]: StyleProps}) {
    let s = {...style};
    let list = [
      'width',
      'height',
      'maxHeight',
      'maxWidth',
      'minHeight',
      'minWidth',
      'margin',
      'marginTop',
      'marginBottom',
      'marginStart',
      'marginEnd',
      'marginLeft',
      'marginRight',
      'marginHorizontal',
      'marginVertical',
      'padding',
      'paddingTop',
      'paddingBottom',
      'paddingStart',
      'paddingEnd',
      'paddingLeft',
      'paddingRight',
      'paddingHorizontal',
      'paddingVertical',
      'top',
      'bottom',
      'left',
      'right',
      'start',
      'end',
      'fontSize',
      'lineHeight',
      'borderRadius',
      'borderWidth',
      'borderTopEndRadius',
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderTopStartRadius',
      'borderBottomEndRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
      'borderBottomStartRadius',
      'borderBottomWidth',
      'borderTopWidth',
      'borderLeftWidth',
      'borderRightWidth',
    ];
    for (let outKey in s) {
      for (let innerKey in s[outKey]) {
        if (
          list.includes(innerKey) &&
          typeof s[outKey][innerKey] === 'number'
        ) {
          s[outKey][innerKey] = scaleSize(s[outKey][innerKey]);
        }
      }
    }
    return StyleSheet.create(s);
  },
};
