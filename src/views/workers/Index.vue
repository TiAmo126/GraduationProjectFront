<template>
  <div class="width-100-per height-100-per">
    <div class="width-100-per height-100-per bg-color-white padding-10-px">
      <div class="margin-bottom-10-px layout-side-n">
        <a-button @click="addWorkers" type="primary">
          <a-icon type="plus"/>
          新增
        </a-button>
        <div>
          <a-input-search
            style="width: 300px;"
            placeholder="请输入员工卡号"
            v-model="searchValue"
            enterButton
            @search="searchCard">
            <a-icon
              v-show="searchValue"
              slot="suffix"
              type="close-circle"
              style="margin-right: 10px;cursor: pointer"
              @click="emptySearch"
            />
          </a-input-search>
        </div>
      </div>
      <!--      员工表格-->
      <a-table
        :scroll="{ y: contentHight }"
        :rowKey="record => record.id"
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :dataSource="workersData">
        <span slot="avatarBase" slot-scope="avatarBase">
          <img :src="avatarBase" width="32px">
        </span>
        <span slot="gender" slot-scope="gender">
          <template v-if="gender==='0'">男</template>
          <template v-else>女</template>
        </span>
        <span slot="role" slot-scope="role">
          <a-tag v-for="tag in role" color="blue" :key="tag">
            <template>{{tag === '1' ? '店员' : '管理员'}}</template>
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-icon type="file-search" title="详情" @click="onViewClick(record.id)"/>&nbsp;
          <a-icon type="form" title="修改" @click="onEditClick(record.id)"/>&nbsp;
          <a-icon type="delete" title="删除" class="color-red" @click="onDeleteClick(record.id)"/>
        </span>
      </a-table>
    </div>
    <!--    新增员工表单-->
    <a-modal
      :title="modalTitle"
      :visible="workersVisible"
      @ok="okWorkers"
      @cancel="cancelWorkers"
      :centered="centered"
      :footer="footers">
      <template slot="footer">
        <a-button-group>
          <a-button key="back" icon="reload" @click="resetWorkers">重置</a-button>
          <template v-if="showSubmit">
            <a-button key="submit" icon="check" type="primary" @click="okWorkers">提交</a-button>
          </template>
          <template v-else>
            <a-button key="update" icon="check" type="primary" @click="updateWorkers">修改</a-button>
          </template>
        </a-button-group>
      </template>
      <div class="width-100-per" style="height: 138px;text-align: center">
        <a-upload
          name="avatar"
          listType="picture"
          :showUploadList="false"
          :action="formData.avatarBase"
          @change="uploadPic"
          :disabled="disabled"
          accept="image/jpg,image/jpeg,image/png">
          <a-avatar icon="user" :size="128" :src="formData.avatarBase" :disabled="disabled"
                    v-decorator="formRules.avatarBase"/>
        </a-upload>
      </div>
      <a-form :form="form">
        <a-form-item label="姓名:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入姓名" :disabled="disabled" v-decorator="formRules.name"/>
        </a-form-item>
        <a-form-item label="性别:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择" :disabled="disabled" v-decorator="formRules.gender">
            <a-select-option value="0">男</a-select-option>
            <a-select-option value="1">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="角色:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择" :disabled="disabled" v-decorator="formRules.role">
            <a-select-option value="0">管理员</a-select-option>
            <a-select-option value="1">店员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="员工卡号:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请录入员工卡号" :disabled="disabled" v-decorator="formRules.cardNumber"/>
        </a-form-item>
        <a-form-item label="出生日期:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-date-picker class="width-100-per" :disabled="disabled" v-decorator="formRules.birthday"/>
        </a-form-item>
        <a-form-item label="身份证号:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入身份证号" :disabled="disabled" v-decorator="formRules.idCard"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import moment from "moment"
  import {availableContentHeight} from "../../lib/utils"
  import {pic2Base64} from '../../lib/utils'
  import {
    Table,
    Input,
    Tag,
    Divider,
    Icon,
    Button,
    Modal,
    Form,
    Select,
    DatePicker,
    Avatar,
    Upload
  } from 'ant-design-vue'

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatarBase',
      key: 'avatarBase',
      width: '20%',
      scopedSlots: {customRender: 'avatarBase'},
    },
    {
      title: '卡号',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      width: '20%',
      scopedSlots: {customRender: 'cardNumber'},
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    }, {
      title: '性别',
      key: 'gender',
      dataIndex: 'gender',
      width: '20%',
      scopedSlots: {customRender: 'gender'},
    }, {
      title: '角色',
      key: 'role',
      dataIndex: 'role',
      scopedSlots: {customRender: 'role'},
    }, {
      title: '操作',
      key: 'action',
      width: 95,
      scopedSlots: {customRender: 'action'},
    }];

  export default {
    name: "Index",
    components: {
      AInput: Input,
      AInputSearch: Input.Search,
      ATable: Table,
      ATag: Tag,
      // ADivider: Divider,
      AButton: Button,
      AButtonGroup: Button.Group,
      AIcon: Icon,
      AModal: Modal,
      AForm: Form,
      AFormItem: Form.Item,
      ASelect: Select,
      ASelectOption: Select.Option,
      ADatePicker: DatePicker,
      AAvatar: Avatar,
      AUpload: Upload,
    },
    data() {
      return {
        columns,
        contentHight: 100,
        disabled: false,
        centered: true,
        workersVisible: false,
        showSubmit: true,
        footers: this.slot,
        loading: false,
        modalTitle: '',
        searchValue: '',
        dateFormat: 'YYYY-MM-DD',
        pagination: {
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ['2', '5', '10', '20', '50', '100'],
          showTotal: total => `共${total}条数据`
        },
        form: this.$form.createForm(this),
        formData: {
          id: '',
          avatarBase: '',
          name: '',
          gender: '',
          role: '',
          cardNumber: '',
          birthday: '',
          idCard: '',
        },
        formRules: {
          name: [
            'name',
            {rules: [{required: true, message: '请输入姓名'}]}
          ],
          gender: [
            'gender',
            {
              initialValue: '0',
              rules: [{required: true, message: '请选择性别'}]
            }
          ],
          role: [
            'role',
            {
              initialValue: '0',
              rules: [{required: true, message: '请选择角色'}]
            }
          ],
          cardNumber: [
            'cardNumber',
            {rules: [{required: true, message: '请录入卡号'}]}
          ],
          birthday: [
            'birthday',
            {
              initialValue: moment(new Date(), this.dateFormat),
              rules: [{required: true, message: '请输入出生日期'}]
            }
          ],
          idCard: [
            'idCard',
            {
              rules: [{
                required: true,
                message: '请输入身份证号'
              }, {
                pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                message: '格式错误'
              }]
            }
          ],
        },
        workersData: [],
        isMessCount: 1,
      }
    },
    watch: {
      searchValue(val) {
        if (val === "") {
          this.emptySearch()
        }
      }
    },
    mounted() {
      this.contentHight = availableContentHeight(310);
      window.onresize = () => {
        this.contentHight = availableContentHeight(310);
      };
      this.showWorkers();
    },
    methods: {
      // 展示后端会员数据信息
      async showWorkers() {
        const that = this;
        that.loading = true;
        that.$apollo.query({
          query: require('../../graphql/workers/query/findAllStaff.gql'),
          variables: {},
          fetchPolicy: 'no-cache'
        }).then(data => {
          const findAllStaff = data.data.findAllStaff;
          that.workersData = [];
          that.workersData.push(...findAllStaff);
          that.loading = false;
        }).catch(error => {
          console.log(error);
          that.loading = false;
        })
      },
      // 上传图片
      uploadPic(e) {
        console.log("11")
        const that = this;
        let files = e.file.originFileObj;
        let size = e.file.size;
        if (size < 1024 * 1024) {
          pic2Base64(files).then(function (result) {
            that.formData.avatarBase = result;
          });
        } else {
          if (that.isMessCount === 1) {
            that.$message.error("图片大小不能大于1M")
          }
          if (that.isMessCount === 3) {
            that.isMessCount = 0;
          }
        }
        that.isMessCount++;
      },
      // 新增员工
      addWorkers() {
        this.modalTitle = '新增员工';
        this.workersVisible = true;
        this.footers = this.slot;
        this.showSubmit = true;
      },
      // 新增提交
      okWorkers() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请录入完整的会员信息！")
          } else {
            let formData = {
              avatarBase: that.formData.avatarBase,
              name: values.name,
              gender: values.gender,
              role: values.role,
              cardNumber: values.cardNumber,
              birthday: moment(values.birthday).format(this.dateFormat),
              idCard: values.idCard,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/workers/mutation/saveStaff.gql'),
              variables: {entity: formData}
            }).then(data => {
              if (data.data.saveStaff.code === "CODE_200") {
                that.$message.success("提交成功");
                that.showWorkers();
                that.resetWorkers();
                that.workersVisible = false;
              } else {
                that.$message.error("提交失败")
              }
            }).catch(error => {
              console.log(error)
            });
          }
        });
      },
      // 删除
      onDeleteClick(id) {
        const that = this;
        this.$confirm({
          title: "删除该员工",
          content: "是否删除该员工?",
          onOk() {
            that.$apollo.mutate({
              mutation: require('../../graphql/workers/mutation/deleteStaffById.gql'),
              variables: {id: id}
            }).then(data => {
              if (data.data.deleteStaffById.code === "CODE_200") {
                that.$message.success("删除成功");
                that.showWorkers();
              }
            }).catch(error => {
              console.log(error)
            })
          },
          onCancel() {
          }
        })
      },
      // 编辑
      onEditClick(id) {
        const that = this;
        that.modalTitle = '编辑员工';
        that.footers = this.slot;
        that.showSubmit = false;
        that.$apollo.query({
          query: require('../../graphql/workers/query/findStaffById.gql'),
          variables: {id: id},
          fetchPolicy: 'network-only'
        }).then(data => {
          const findStaffById = data.data.findStaffById;
          setTimeout(() => {
            that.formData.avatarBase = findStaffById.avatarBase;
            that.formData.id = id;
            that.form.setFieldsValue({
              name: findStaffById.name,
              birthday: moment(findStaffById.birthday),
              cardNumber: findStaffById.cardNumber,
              gender: findStaffById.gender,
              idCard: findStaffById.idCard,
              role: findStaffById.role,
            });
          }, 0);
          that.workersVisible = true;
        }).catch(error => {
          console.log(error)
        });
      },
      // 编辑提交
      updateWorkers() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请输入正确信息！")
          } else {
            let formData = {
              id: that.formData.id,
              avatarBase: that.formData.avatarBase,
              name: values.name,
              gender: values.gender,
              role: values.role,
              cardNumber: values.cardNumber,
              birthday: moment(values.birthday).format(this.dateFormat),
              idCard: values.idCard,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/workers/mutation/saveStaff.gql'),
              variables: {entity: formData}
            }).then(data => {
              if (data.data.saveStaff.code === "CODE_200") {
                that.$message.success("提交成功");
                that.showWorkers();
                that.resetWorkers();
                that.workersVisible = false;
              } else {
                that.$message.error("提交失败")
              }
            }).catch(error => {
              console.log(error)
            });
          }
        });
      },
      // 详情
      onViewClick(id) {
        const that = this;
        that.disabled = true;
        that.modalTitle = '员工详情';
        that.footers = null;
        that.$apollo.query({
          query: require('../../graphql/workers/query/findStaffById.gql'),
          variables: {id: id},
          fetchPolicy: 'network-only'
        }).then(data => {
          const findStaffById = data.data.findStaffById;
          setTimeout(() => {
            that.formData.avatarBase = findStaffById.avatarBase;
            that.form.setFieldsValue({
              name: findStaffById.name,
              birthday: moment(findStaffById.birthday),
              cardNumber: findStaffById.cardNumber,
              gender: findStaffById.gender,
              idCard: findStaffById.idCard,
              role: findStaffById.role,
            });
          }, 0);
          that.workersVisible = true;
        }).catch(error => {
          console.log(error)
        });
      },
      // 关闭弹框
      cancelWorkers() {
        const that = this;
        this.workersVisible = false;
        this.disabled = false;
        setTimeout(() => {
          that.resetWorkers()
        }, 200)
      },
      // 重置表单
      resetWorkers() {
        this.form.resetFields();
        this.formData.avatarBase = '';
        this.formData.id = ''
      },
      // 搜索员工卡号
      searchCard() {
        const that = this;
        if (that.searchValue === "") {
          that.$message.warning("请输入要搜索的员工卡号")
        } else {
          that.loading = true;
          that.$apollo.query({
            query: require('../../graphql/workers/query/findStaffByCardNumber.gql'),
            variables: {cardNumber: that.searchValue},
            fetchPolicy: 'no-cache'
          }).then(data => {
            that.workersData = [];
            that.workersData.push(...data.data.findStaffByCardNumber);
            that.loading = false;
          })
        }
      },
      // 清空搜索框
      emptySearch() {
        this.searchValue = "";
        this.showWorkers();
      },
      moment,
    }
  }
</script>

<style scoped>

</style>
