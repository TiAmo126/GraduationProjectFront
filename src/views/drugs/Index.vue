<template>
  <div class="width-100-per height-100-per layout-side-n">
    <div class="height-100-per bg-color-white overflow-auto" style="width: 230px">
      <a-button-group style="margin: 8px 8px 0">
        <a-button style="width: 70px;padding: 0 8px;" icon="plus" @click="leftAdd">新增</a-button>
        <a-button style="width: 70px;padding: 0 8px;" icon="edit" @click="leftUpdate">编辑</a-button>
        <a-button style="width: 70px;padding: 0 8px;" icon="delete" @click="leftDelete">删除</a-button>
      </a-button-group>
      <a-input-search style="margin: 8px 8px 0;width: 208px;" placeholder="搜索" @change="selectChange"/>
      <div class="overflow-auto width-100-per">
        <div class="disabled width-100-per text-align-center" v-if="noneData === 0">暂无数据</div>
        <a-tree
          :treeData="durgsTypeData"
          :autoExpandParent="autoExpandParent"
          defaultExpandAll
          @select="treeSelect"
          v-if="durgsTypeData.length > 0">
        </a-tree>
      </div>
    </div>
    <div class="height-100-per bg-color-white padding-10-px" style="width: calc(100% - 240px)">
      <router-view></router-view>
    </div>
    <!--    药品分类弹框-->
    <a-modal
      :title="modalTitle"
      :visible="drugsTypeVisible"
      @ok="okDrugsType"
      @cancel="cancelDrugsType"
      width="360px"
    >
      <template slot="footer">
        <a-button-group>
          <a-button key="back" icon="reload" @click="resetDrugsType">重置</a-button>
          <template v-if="showSubmit">
            <a-button key="submit" icon="check" type="primary" @click="okDrugsType">提交</a-button>
          </template>
          <template v-else>
            <a-button key="update" icon="check" type="primary" @click="updateDrugsType">修改</a-button>
          </template>
        </a-button-group>
      </template>
      <a-form :form="form">
        <a-form-item style="margin-bottom: 0" label="名称:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入药品分类名称" v-decorator="formRules.name"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {Button, Input, Tree, Modal, Form} from "ant-design-vue"
  import {selectTree} from "../../lib/utils"

  export default {
    name: "Index",
    components: {
      AButton: Button,
      AButtonGroup: Button.Group,
      AInput: Input,
      AInputSearch: Input.Search,
      ATree: Tree,
      AModal: Modal,
      AForm: Form,
      AFormItem: Form.Item,
    },
    data() {
      return {
        durgsTypeData: [],
        durgsTypeDataBase: [],
        noneData: 1,
        spinning: false,
        autoExpandParent: true,
        drugsTypeId: '',
        selectTreeNode: null,
        centered: true,
        drugsTypeVisible: false,
        modalTitle: '',
        showSubmit: true,
        form: this.$form.createForm(this),
        formData: {
          id: '',
          parentId: '',
        },
        formRules: {
          name: [
            'name',
            {rules: [{required: true, message: '请输入类名'}]}
          ]
        },
      }
    },
    mounted() {
      this.showDurgsTypeTree();
    },
    methods: {
      // 展示药品分类树
      showDurgsTypeTree() {
        const that = this;
        that.$apollo.query({
          query: require('../../graphql/drugs/query/findAllDurgType.gql'),
          variables: {},
          fetchPolicy: 'no-cache'
        }).then(data => {
          const findAllDurgType = data.data.findAllDurgType;
          let newTree = [];
          for (let f of findAllDurgType) {
            if (f.parentId === '1') {
              let ct = that.durgsTypeTreeDg(f, findAllDurgType);
              if (ct.length !== 0) {
                newTree.push({
                  title: f.name,
                  key: f.id,
                  children: that.durgsTypeTreeDg(f, findAllDurgType)
                })
              } else {
                newTree.push({
                  title: f.name,
                  key: f.id,
                })
              }
            }
          }
          that.durgsTypeData = [{
            title: '药品分类总览',
            key: '1',
            children: newTree
          }];
          const base = that.durgsTypeData;
          that.durgsTypeDataBase = base;
        }).catch(error => {
          console.log(error)
        });
      },
      // 药品分类树递归
      durgsTypeTreeDg(pt, data) {
        const that = this;
        let newR = [];
        for (let d of data) {
          if (d.parentId === pt.id) {
            let ct = that.durgsTypeTreeDg(d, data);
            if (ct.length !== 0) {
              newR.push({
                title: d.name,
                key: d.id,
                children: ct
              })
            } else {
              newR.push({
                title: d.name,
                key: d.id,
              })
            }
          }
        }
        return newR;
      },
      // 搜索药品分类
      selectChange(e) {
        const that = this;
        const value = e.target.value;
        that.durgsTypeData = selectTree(value, that.durgsTypeDataBase);
        if (that.durgsTypeData.length > 0) {
          that.noneData = 1
        } else {
          that.noneData = 0
        }
      },
      // 新增药品分类
      leftAdd() {
        const that = this;
        if (that.drugsTypeId === null || that.drugsTypeId === undefined || that.drugsTypeId === '') {
          that.$message.error("请选择上级分类");
          return;
        }
        that.modalTitle = '在[' + (that.selectTreeNode.title) + ']下新增分类';
        that.showSubmit = true;
        that.drugsTypeVisible = true;
      },
      // 新增提交
      okDrugsType() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请填写完整信息！")
          } else {
            let formData = {
              name: values.name,
              parentId: that.selectTreeNode.key,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/drugs/mutation/saveDurgType.gql'),
              variables: {entity: formData}
            }).then((data) => {
              if (data.data.saveDurgType.code === "CODE_200") {
                that.$message.success("提交成功");
                that.showDurgsTypeTree();
                that.drugsTypeVisible = false;
                that.resetDrugsType();
              }
            }).catch(error => {
              console.log(error)
            });
          }
        });
      },
      // 编辑药品分类
      leftUpdate() {
        const that = this;
        if (that.drugsTypeId === null || that.drugsTypeId === undefined || that.drugsTypeId === '') {
          that.$message.error("请选择要修改的分类");
          return;
        }
        if (that.drugsTypeId === '1') {
          that.$message.error("总览不可修改");
          return;
        }
        that.modalTitle = '编辑药品分类';
        that.showSubmit = false;
        that.$apollo.query({
          query: require('../../graphql/drugs/query/findDurgTypeById.gql'),
          variables: {id: that.drugsTypeId},
          fetchPolicy: 'network-only'
        }).then(data => {
          const findDurgTypeById = data.data.findDurgTypeById;
          that.formData = {
            id:findDurgTypeById.id,
            parentId: findDurgTypeById.parentId
          };
          setTimeout(() => {
            that.form.setFieldsValue({
              name: findDurgTypeById.name
            });
          }, 0);
          that.drugsTypeVisible = true;
        })
      },
      // 编辑提交
      updateDrugsType() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请填写完整信息！")
          } else {
            let formData = {
              id: that.formData.id,
              name: values.name,
              parentId: that.formData.parentId,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/drugs/mutation/saveDurgType.gql'),
              variables: {entity: formData}
            }).then((data) => {
              if (data.data.saveDurgType.code === "CODE_200") {
                that.$message.success("修改成功");
                that.showDurgsTypeTree();
                that.drugsTypeVisible = false;
                that.resetDrugsType();
              }
            }).catch(error => {
              console.log(error)
            });
          }
        });
      },
      // 删除药品分类
      leftDelete() {
        const that = this;
        if (that.drugsTypeId === null || that.drugsTypeId === undefined || that.drugsTypeId === '') {
          that.$message.error("请选择要删除的分类");
          return;
        }
        if (that.drugsTypeId === '1') {
          that.$message.error("总览不可删除");
          return;
        }
        this.$confirm({
          title: "删除该分类",
          content: "是否删除该分类?",
          onOk() {
            that.$apollo.mutate({
              mutation: require('../../graphql/drugs/mutation/deleteDurgType.gql'),
              variables: {id: that.drugsTypeId}
            }).then(data => {
              if (data.data.deleteDurgType.code === "CODE_200") {
                that.$message.success("删除成功");
                that.showDurgsTypeTree();
                that.drugsTypeId = ''
              }
            }).catch(error => {
              console.log(error)
            })
          },
          onCancel() {
          }
        })
      },
      // 点击树节点
      treeSelect(selectedKey, e) {
        this.drugsTypeId = selectedKey[0];
        this.selectTreeNode = e.node.dataRef;
        if (selectedKey[0] !== undefined || selectedKey[0] !== "") {
          this.$router.push({path:"/drugs",query:{id: selectedKey[0]}})
        }
      },
      // 重置表单
      resetDrugsType() {
        this.form.resetFields();
      },
      // 关闭弹框
      cancelDrugsType() {
        const that = this;
        that.drugsTypeVisible = false;
        setTimeout(() => {
          that.resetDrugsType()
        }, 200)
      },
    }
  }
</script>

<style scoped>

</style>
