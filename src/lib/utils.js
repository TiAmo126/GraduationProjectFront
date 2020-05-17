import router from '@/config/router'

export const availableContentHeight = (height) => {
  return `${document.documentElement.clientHeight}` - height;//减去tab栏和面包屑栏高度
};
export const availableContentWidth = (width) => {
  return `${document.documentElement.clientWidth}` - width;//减去相应宽度
};
// 图片转base64字节
export const pic2Base64 = (file) => {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  }).catch(error => {
    console.log(error)
  })
};
// 查找方法
export const selectTree = (value, gData, expandedKeys) => {
  return gData.map((item) => {
    return getParentValue(value, item, expandedKeys);
  }).filter((item, i, self) => item && self.indexOf(item) === i)
};
// 查找树的节点
const getParentValue = (value, tree, expandedKeys) => {
  let parentValue;
  if (tree.title.indexOf(value) > -1) {
    parentValue = {
      key: tree.key,
      title: tree.title,
    };
    if (tree.children !== undefined) {
      parentValue.children = [];
      for (let t of tree.children) {
        let childNode = getParentValue(value, t, expandedKeys);
        if (childNode !== undefined) {
          parentValue.children.push(childNode)
        }
      }
    }
    if (expandedKeys !== undefined) {
      expandedKeys.push(parentValue.key);
    }
    return parentValue
  } else {
    if (tree.children !== undefined) {
      parentValue = {
        key: tree.key,
        title: tree.title,
        children: []
      };
      for (let t of tree.children) {
        let childNode = getParentValue(value, t, expandedKeys);
        if (childNode !== undefined) {
          parentValue.children.push(childNode);
        }
      }
      if (parentValue.children.length !== 0) {
        return parentValue;
      }
    }
  }
};
