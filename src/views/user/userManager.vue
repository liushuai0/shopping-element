/ *
* 文件名：userManager
* 作者： 刘帅
* 描述：用户列表页
* 创建时间：2020-05-25 18:13
* /
<template>
    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">

                    <el-input @clearable="handleClear()" clearable placeholder="请输入标题" v-model="listQuery.query">
                        <el-button @click="getList()" icon="el-icon-search" slot="append" type="primary"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="addUser()" type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" highlight-current-row style="width: 100%;" v-loading="listLoading">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column :index="indexMethod" label="序号" type="index" width="60">
                </el-table-column>
                <el-table-column label="姓名" prop="username" sorable width="120">
                </el-table-column>
                <el-table-column label="邮箱" prop="email">
                </el-table-column>
                <el-table-column label="角色" prop="role_name">
                </el-table-column>
                <el-table-column label="手机号" prop="mobile">
                </el-table-column>
                <el-table-column label="状态" prop="mobile">
                    <template slot-scope="scope">
                        <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time">
                </el-table-column>

                <el-table-column label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                        <el-button @click="handleQx(scope.$index, scope.row)" size="small">设置权限</el-button>
                        <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--            <pagination v-show="total>0" :total="total" :page.sync="listQuery.pagenum" :limit.sync="listQuery.pagesize" @pagination="getList" />-->
            <el-pagination
                    :current-page="page"
                    :page-size="10"
                    :page-sizes="[10,15, 20]"
                    :total="total"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <el-dialog
                    :visible.sync="dialogEditVisible"
                    @close="handleClose()"
                    title="提示"
                    width="30%">
                <el-form :model="editUserForm" ref="editUserFormRef">
                    <el-form-item label="姓名" prop="username" width="120">
                        <el-input :disabled="dialogStatus==='1'" v-model="editUserForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editUserForm.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" v-if="dialogStatus==='0'">
                        <el-input v-model="editUserForm.password"></el-input>
                    </el-form-item>
                </el-form>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="dialogEditVisible = false">取 消</el-button>
                    <el-button @click="editSave()" type="primary">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配角色对话框 -->
            <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
                <div>
                    <p>当前用户：{{userInfo.username}}</p>
                    <p>当前角色：{{userInfo.role_name}}</p>
                    <p>
                        分配角色：
                        <el-select
                                v-model="selectRoleId"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择文章标签"
                        >
                            <el-option
                                    v-for="item in rolesList"
                                    :key="item.id"
                                    :label="item.roleName"
                                    :value="item.id"
                            ></el-option>
                        </el-select>
                    </p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </div>
            </el-dialog>


        </el-card>


    </div>

</template>

<script>
    import {
        reqUserList,
        updateUserStatus,
        reqUserInfo,
        updateUserInfo,
        reqJueSeList,
        updateRoleInfo,
        queryJueSeById,
        addUserInfo,
        delUserInfo
    } from '../../api/index'

    export default {
        name: "userManager",
        data() {
            return {
                index: 1,
                total: 0,   //总共
                page: 1,
                listLoading: true,
                listQuery: {
                    'query': '',
                    'pagenum': 1,// 当前页数
                    'pagesize': 15// 每页显示多少数据
                },
                tableData: [],
                search: '',
                currentRow: null,
                dialogEditVisible: false,   //修改用户
                dialogAddVisible: false,  //添加用户
                editUserForm: {},  //修改表单数据
                addUserForm: {},   //编辑表单数据 差一个密码
                dialogStatus: null,  //添加还是修改表单 0添加 1修改
                setRoleDialogVisible: false,
                userInfo: {},  //权限用户信息对象
                selectRoleId: '',  //选中角色id
                rolesList: [],  //角色数组
            }
        },
        computed: {
            indexMethod(index) {
                return (this.listQuery.pagenum - 1) * this.listQuery.pagesize + this.index;
            }
        },
        created() {
            this.getList()
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },

            async getList() {
                // 发送ajax请求密码登陆
                var result = await reqUserList(this.listQuery)
                if (result.meta.status !== 200) {

                    this.listLoading = false
                    return this.$message.error("获取用户列表失败")
                }
                this.tableData = result.data.users
                this.total = result.data.total
                this.page = result.data.pagenum
                this.listLoading = false

            },
            async userStateChanged(row) {
                console.log(row)
                var params = {}
                params.uId = row.id
                params.mg_state = row.mg_state
                var result = await updateUserStatus(params)

                this.$message({
                    message: result.meta.msg,
                    type: 'success'
                });

            },

            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            async handleEdit(index, row) {
                console.log(row)
                this.dialogStatus = '1'
                this.dialogEditVisible = true;//放在第一个   this.$nextTick 可以在下次打开的时候重置表单数据
                const result = await reqUserInfo(row.id)

                if (result.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败！')
                }
                this.$nextTick(() => {
                    this.editUserForm = result.data
                });
                console.log(this.editUserForm)

            },
            async handleQx(index, row) {
                const _result = await reqJueSeList(row.id)
                console.log(_result)
                if (_result.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败！')
                }
                this.userInfo = row
                this.rolesList = _result.data

                this.setRoleDialogVisible = true


            },
            async handleDel(index, row) {
                console.log(row)
                const confirmResult = await this.$confirm('确定删除此用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error);
                // 点击确定 返回值为：confirm
                // 点击取消 返回值为： cancel
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const result = await delUserInfo(row.id)
                if (result.meta.status !== 200) {
                    return this.$message.error('删除用户失败！')
                }
                this.$message.success("删除用户成功")
                this.getList()
            },
            handleClose() {
                this.$refs.editUserFormRef.resetFields()  //重置表单

                // this.dialogEditVisible=false
            },
            setRoleDialogClosed() {
                // 分配角色对话框关闭事件
                this.selectRoleId = ''
                this.userInfo = {}
            },
            async editSave() {
                console.log(this.editUserForm)
                if (this.dialogStatus === '0') {
                    console.log(this.editUserForm)
                    const result = await addUserInfo(this.editUserForm)
                    if (result.meta.status !== 201) {
                        return this.$message.error('新增用户信息失败！')
                    }
                    this.$message("新增用户信息成功")
                } else {
                    const result = await updateUserInfo(this.editUserForm)
                    console.log(result)
                    if (result.meta.status !== 200) {
                        return this.$message.error('更新用户信息失败！')
                    }
                    this.$message("更新用户信息成功")
                }


                this.dialogEditVisible = false
                this.getList()
            },
            //分配权限保存
            async saveRoleInfo() {
                var params = {
                    "rid": this.selectRoleId,
                    "id": this.userInfo.id
                }
                const result = await updateRoleInfo(params)
                console.log(result)
                if (result.meta.status !== 200) {
                    return this.$message.error('更新权限失败！')
                }

                this.$message("更新用户信息成功")
                this.setRoleDialogVisible = false
                this.getList()
            },
            addUser() {
                this.dialogStatus = '0'
                this.dialogEditVisible = true
            },
            handleSizeChange(newSize) {
                this.listQuery.pagesize = newSize
                this.getList()
            },
            handleCurrentChange(newNum) {
                this.listQuery.pagenum = newNum
                this.getList()
            }
        }

    }
</script>

<style scoped>

</style>
