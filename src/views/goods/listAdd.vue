<template>
    <div>
        <el-card>
            <el-tag style="width: 100%;text-align: center" type="info">添加商品信息</el-tag>
            <el-steps :active="activeId-0" align-center finish-status="success" style="font-size: 10px!important;">
                <el-step title="基本信息" ></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form ref="form" :model="formData" label-width="80px">
                <el-tabs  @tab-click="tabClicked()" tab-position="left" v-model='activeId' style="height: 700px;">
                    <el-tab-pane label="基本信息">
                        <el-form ref="addFormRef" style="margin-left: 20px" :rules="rules" label-position="top" :model="addForm" label-width="80px">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="addForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="addForm.goods_price"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="addForm.goods_weight"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="addForm.goods_number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" prop="goods_cat">
                                <el-cascader
                                        v-model="addForm.goods_cat"
                                        :options="cateList"
                                        :props="cascaderProps"
                                        @change="handleChange">

                                </el-cascader>


                            </el-form-item>

                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性">商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片">商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品 -->
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>

                </el-tabs>
            </el-form>

        </el-card>
    </div>
</template>

<script>
    import {addShopList,getGoodsList} from '../../api/index'
    export default {
        name: "add",
        data(){
            return {
                formData:{

                },
                addForm:{
                    goods_name:'',
                    goods_price:'',
                    goods_weight:'',
                    goods_number:'',
                    goods_cat:'',
                    // 商品详情描述
                    goods_introduce: '',
                    pics:[],
                    attrs:[]
                },
                // 级联选择器配置
                cascaderProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                cateList:[],
                activeId:'0',
                rules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }

                    ],
                    goods_price: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    goods_weight: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    goods_number: [
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    goods_introduce: [
                        { required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                    ],

                }
            }
        },
        mounted() {

        },
        created () {
            this.getCateList()
        },
        methods:{
            tabClicked(){
                console.log("1232")
                console.log("123")
            },
            async getCateList(){
                var params={
                    type:[1,2,3],
                }
                let _result= await getGoodsList(params)
                this.cateList=_result.data

            },
            //添加商品
            async addGoods(){
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return this.$message.error('请填写必要的表单项！')
                    this.addForm.goods_cat=this.addForm.goods_cat.toString()
                    let _result= await addShopList(this.addForm)
                    console.log(_result)
                    if(_result.meta.status===201){
                        this.$message.success("添加成功")
                        this.$router.push('/list')
                    }


                })
            },
            handleChange(value){
                console.log(value)
            }
        }
    }
</script>

<style scoped>

</style>
