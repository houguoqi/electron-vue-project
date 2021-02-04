<template>
  <el-table :data="tableData" style="width: 100%" stripe>
    <el-table-column align="center" prop="id" label="ID" sortable></el-table-column>
    <el-table-column align="center" prop="user_id" label="用户ID" sortable></el-table-column>
    <el-table-column align="center" prop="username" label="用户名" sortable></el-table-column>
    <el-table-column align="center" prop="count" label="压缩数量" sortable></el-table-column>
    <el-table-column align="center" prop="createdate" label="压缩时间" sortable></el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getRecords()
  },
  methods: {
    getRecords() {
      this.$http.get('/get_compress_record').then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.tableData = res.data.result
        } else {
          this.$message.warning(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>