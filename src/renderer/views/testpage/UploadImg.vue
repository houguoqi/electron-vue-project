<template>
  <div>
    <el-upload
      action=""
      list-type="picture-card"
      :multiple="multiple"
      :limit="limit"
      :auto-upload="false"
      :on-change="uploadChange"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-col>
      <el-button @click="imgDeal" size="small">压缩</el-button>
    </el-col>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        multiple: true,
        limit: 50,
        file: null,
        fileList: [],
        compressFileList: []
      };
    },
    methods: {
      uploadChange(file, fileList) {
        this.fileList = []
        if (fileList.length) {
          fileList.forEach(ele => {
            this.fileList.push(ele.raw)
          });
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      imgDeal() {
        if (this.fileList.length) {
          const loading = this.$loading({
            text: '压缩中...'
          })
          this.fileList.forEach(ele => {
            this.file = ele
            this.imgCompress(ele)
          })
          loading.close();
          this.$message({
            message: '压缩成功',
            type: 'success'
          });
          console.log(this.compressFileList, 'compressFileList')
        }
      },
      // 处理图片
      imgCompress(file) {
          let self = this
          // 看支持不支持FileReader
          if (!file || !window.FileReader) return
          if (/^image/.test(file.type)) {
              // 创建一个reader
              let reader = new FileReader()
              // 将图片2将转成 base64 格式
              reader.readAsDataURL(file)
              // 读取成功后的回调
              reader.onloadend = function() {
                  let result = this.result
                  let img = new Image()
                  img.src = result
                  //判断图片是否大于500K
                  if (this.result.length <= 500 * 1024) {
                      console.log('文件小于500KB')
                  } else {
                      console.log('文件大于500KB')
                  }
                  img.onload = function() {
                      let data = self.compress(img)
                      self.compressFileList.push(self.dataURLtoFile(data, file))
                  }
              }
          }
      },
      // 压缩图片
      compress(img) {
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')
          //瓦片canvas
          let tCanvas = document.createElement('canvas')
          let tctx = tCanvas.getContext('2d')
          // let initSize = img.src.length;
          let width = img.width
          let height = img.height
          //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
          let ratio
          if ((ratio = (width * height) / 4000000) > 1) {
              // console.log("大于400万像素");
              ratio = Math.sqrt(ratio)
              width /= ratio
              height /= ratio
          } else {
              ratio = 1
          }
          canvas.width = width
          canvas.height = height
          //    铺底色
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          //如果图片像素大于100万则使用瓦片绘制
          let count
          if ((count = (width * height) / 1000000) > 1) {
              // console.log("超过100W像素");
              count = ~~(Math.sqrt(count) + 1) //计算要分成多少块瓦片
              //      计算每块瓦片的宽和高
              let nw = ~~(width / count)
              let nh = ~~(height / count)
              tCanvas.width = nw
              tCanvas.height = nh
              for (let i = 0; i < count; i++) {
              for (let j = 0; j < count; j++) {
                  tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
                  ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
              }
              }
          } else {
              ctx.drawImage(img, 0, 0, width, height)
          }
          //进行最小压缩
          let ndata = canvas.toDataURL('image/jpeg', 0.1)
          tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
          return ndata
      },
      //将base64转换为文件
      dataURLtoFile(data, file) {
          var arr = data.split(','),
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n)
          while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
          }
          return new File([u8arr], file.name, {
              type: file.type
          })
      },
    }
  }
</script>