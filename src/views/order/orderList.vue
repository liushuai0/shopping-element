/ *
* 文件名：orderList
* 作者： 刘帅
* 描述：订单列表
* 创建时间：2020-05-25
* /
<template>
<div>
    <el-card>
        <el-row :gutter="20">
            <el-col :span="6">

                <el-input clearable placeholder="请输入内容" v-model="listQuery.query">
                    <el-button @click="getList()" icon="el-icon-search" slot="append" type="primary"></el-button>
                </el-input>
            </el-col>

        </el-row>

        <el-table :data="tableData" highlight-current-row style="width: 100%;" v-loading="listLoading">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column :index="indexMethod" label="序号" type="index" width="60">
            </el-table-column>
            <el-table-column label="订单编号" prop="order_number" sorable width="280">
            </el-table-column>
            <el-table-column label="订单价格" prop="order_price">
            </el-table-column>
            <el-table-column label="是否付款">
                <template slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.pay_status==='1'">未付款</el-tag>
                    <el-tag type="success" v-else>已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send">
            </el-table-column>
            <el-table-column label="下单时间" prop="create_time">

            </el-table-column>

            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑地址</el-button>
                    <el-button @click="findLogistics(scope.$index, scope.row)" size="small" type="danger">查看物流
                    </el-button>
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
                title="修改地址"

                width="50%">
            <el-form :model="editUserForm" label-width="100px" ref="editUserFormRef">
                <el-form-item label="省市区/县" prop="shengshiqu">
                    <el-cascader
                            v-model="editUserForm.shengshiqu"
                            :emitPath="false"
                            :options="cityData"
                            :props="cascaderProps"
                            style="width: 100%;"
                            @change="cascaderChange"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="consignee_addr">
                    <el-input v-model="editUserForm.consignee_addr"></el-input>
                </el-form-item>

            </el-form>
            <span class="dialog-footer" slot="footer">
                    <el-button @click="dialogEditVisible = false">取 消</el-button>
                    <el-button @click="editSave()" type="primary">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog
                :visible.sync="dialogwuliuVisible"
                @close="handlewuliuClose()"
                title="查看物流"
                width="50%"


        >
            <div style="padding: 20px 30px">
                <el-timeline>
                    <el-timeline-item
                            v-for="(activity, index) in wuliuList"
                            :key="index"
                            :timestamp="activity.ftime">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
            </div>


        </el-dialog>


    </el-card>
</div>
</template>

<script>
    import {getOrderList, getOrderInfo, getOrderLogistics} from '../../api/index'
    import cityData from './citydata.js'
    export default {
        name: "orderList",
        data() {
            return {
                listQuery: {
                    'query': '',
                    'pagenum': 1,// 当前页数
                    'pagesize': 12// 每页显示多少数据
                },
                tableData: [],
                listLoading: true,
                index: 1,
                total: 0,   //总共
                page: 1,
                editUserForm: {},
                dialogEditVisible: false,
                // 级联选择器配置
                cascaderProps: {
                    expandTrigger: 'hover',
                    label: 'label',
                    value: 'value',
                    children: 'children'
                },
                cityData,
                wuliuList: [],
                dialogwuliuVisible: false,
            }
        },
        computed: {
            indexMethod(index) {
                return (this.listQuery.pagenum - 1) * this.listQuery.pagesize + this.index;
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            async getList() {
                var params = this.listQuery;
                let _result = await getOrderList(params);
                if (_result.meta.status !== 200) {
                    return this.$message.error("获取订单列表失败")
                }
                this.tableData = _result.data.goods
                this.total = _result.data.total;
                this.listLoading = false
            },
            handleSizeChange(newSize) {
                console.log("123")
                this.listQuery.pagesize = newSize
                this.getList()
            },
            handleCurrentChange(newNum) {
                this.listQuery.pagenum = newNum
                this.getList()
            },
            async handleEdit(index, item) {

                let _result = await getOrderInfo(item.order_id);
                if (_result.meta.status !== 200) {
                    return this.$message.error("获取订单列表失败")
                }
                this.editUserForm = _result.data

                this.dialogEditVisible = true

            },

            handleClose() {
                this.$refs.editUserFormRef.resetFields()  //重置表单
            },
            cascaderChange(value) {
                console.log(value)
                this.editUserForm.shengshiqu = value
            },
            //编辑保存
            editSave() {
                this.$message({
                    type: 'info',
                    message: `您修改的地址是: ${this.editUserForm.shengshiqu}
                              您修改的详细地址是: ${this.editUserForm.consignee_addr}
                    `
                });
            },
            async findLogistics() {
                let _result = await getOrderLogistics('1106975712662');
                if (_result.meta.status !== 200) {
                    return this.$message.error("获取订单列表失败")
                }
                this.wuliuList = _result.data

                this.dialogwuliuVisible = true
            },
            handlewuliuClose() {

            }

        }
    }
</script>

<style scoped>

</style>
