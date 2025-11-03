/* eslint-disable @typescript-eslint/no-explicit-any */
function addScriptTag(src: string) {
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.src = src
    document.body.appendChild(script)
}

// sm3 依赖包
addScriptTag('/static/sm3-1.0.js')
addScriptTag('/static/hex.js')
addScriptTag('/static/byteUtil.js')

declare let Hex: any
declare let SM3Digest: any

// sm3加密
export default function (text: string): string {
  // 这一步是先将输入数据转成utf-8编码的字节流，然后再转成16进制可见字符
  const dataBy = Hex.utf8StrToBytes(text)
  const sm3 = new SM3Digest()
  // 数据很多的话，可以分多次update
  sm3.update(dataBy, 0, dataBy.length)
  // 得到的数据是个byte数组
  const sm3Hash = sm3.doFinal()
  // 编码成16进制可见字符
  const sm3HashHex = Hex.encode(sm3Hash, 0, sm3Hash.length)

  return sm3HashHex
}
