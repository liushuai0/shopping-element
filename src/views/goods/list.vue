/ *
* 文件名：list
* 作者： 刘帅
* 描述：商品列表
* 创建时间：2020-05-25
* /
<template>

    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">

                    <el-input clearable placeholder="请输入内容" v-model="listQuery.query">
                        <el-button @click="getTableList()" icon="el-icon-search" slot="append"
                                   type="primary"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button @click="addUser()" type="primary">添加商品</el-button>
                </el-col>
            </el-row>

            <el-table :data="tableData" highlight-current-row style="width: 100%;" v-loading="listLoading">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column :index="indexMethod" label="序号" type="index" width="60">
                </el-table-column>
                <el-table-column label="商品名称" prop="goods_name" sorable>
                </el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price">
                </el-table-column>
                <el-table-column label="商品重量" prop="goods_weight">
                </el-table-column>
                <el-table-column label="商品数量" prop="goods_number">
                </el-table-column>

                <el-table-column label="创建时间" prop="add_time">
                </el-table-column>

                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                        <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                    title="编辑商品"
                    width="40%">
                <el-form :model="editCateForm" label-position="top" ref="editUserFormRef">
                    <el-form-item label="商品名称" prop="goods_name" width="120">
                        <el-input v-model="editCateForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="价格" prop="goods_price">
                        <el-input v-model="editCateForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="goods_number">
                        <el-input v-model="editCateForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="重量" prop="goods_weight">
                        <el-input v-model="editCateForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader
                                v-model="editCateForm.goods_cat"
                                :emitPath="false"
                                :options="cateList"
                                :props="cascaderProps"
                                style="width: 100%;"
                                @change="cascaderChange"
                        >

                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="dialogEditVisible = false">取 消</el-button>
                    <el-button @click="editSave()" type="primary">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>

    </div>
</template>

<script>
    import {getShopList, delShopList, editShopList, getGoodsList, getShopListById} from '../../api/index'

    export default {
        name: "list",
        data() {
            return {
                listQuery: {
                    'query': '',
                    'pagenum': 1,// 当前页数
                    'pagesize': 12// 每页显示多少数据
                },
                listLoading: true,
                tableData: [],

                dialogEditVisible: false,
                editCateForm: {},
                // 级联选择器配置
                cascaderProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                cateList: [],
                index: 1,
                total: 0,   //总共
                page: 1,



            }
        },
        computed: {
            indexMethod(index) {
                return (this.listQuery.pagenum - 1) * this.listQuery.pagesize + this.index;
            }
        },
        mounted() {

            this.getTableList()

        },
        created() {
            this.getCateList()
        },
        methods: {
            async getTableList() {
                let _result = await getShopList(this.listQuery)
                if (_result.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败！')
                }
                this.tableData = _result.data.goods
                this.total = _result.data.total;
                this.listLoading = false
                console.log(_result)
            },
            async getCateList() {
                var params = {
                    type: [1, 2, 3],
                }
                let _result = await getGoodsList(params)
                console.log("123")
                this.$nextTick(() => {
                    this.cateList = _result.data
                })

            },

            addUser() {
                this.$router.push('/list/add')
            },
            async handleDel(index, row) {
                const confirmResult = await this.$confirm('清点删除该商品？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error);
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const result = await delShopList(row.goods_id)
                if (result.meta.status !== 200) {
                    return this.$message.error('删除失败！')
                }
                this.$message.success("删除成功")
                this.getTableList()

            },
            //编辑按钮
            async handleEdit(index, item) {
                const _result = await getShopListById(item.goods_id)
                console.log(_result)
                if (_result.meta.status !== 200) {
                    return this.$message.error('查询失败！')
                }
                this.$nextTick(() => {

                    this.getCateList().then(() => {
                        this.editCateForm = _result.data
                        var str = this.editCateForm.goods_cat
                        str = str.split(',')
                        this.editCateForm.goods_cat = str.map(Number)
                        console.log(this.editCateForm)
                    })


                })


                this.dialogEditVisible = true

            },
            //编辑提交
            async editSave() {
                var formData = JSON.stringify(this.editCateForm)
                formData = JSON.parse(formData)
                formData.id = formData.goods_id
                formData.pics = []
                formData.attrs = []
                console.log(formData.goods_cat)
                var goods_cat = formData.goods_cat.toString()
                formData.goods_cat = goods_cat
                console.log(formData)
                const result = await editShopList(formData)
                if (result.meta.status !== 200) {
                    return this.$message.error('编辑保存失败！')
                }
                this.$message.success("编辑成功")
                this.dialogEditVisible = false
                this.getTableList()
            },
            //弹窗关闭，写刷新表格
            handleClose() {
                this.$refs.editUserFormRef.resetFields()  //重置表单
            },
            cascaderChange(value) {
                console.log(value)
            },
            handleSizeChange(newSize) {
                this.listQuery.pagesize = newSize
                this.getList()
            },
            handleCurrentChange(newNum) {
                this.listQuery.pagenum = newNum
                this.getList()
            },

        }
    }
</script>

<style scoped>

</style>
