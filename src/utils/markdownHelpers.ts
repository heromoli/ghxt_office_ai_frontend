/**
 * 修复不完整的 Markdown 代码块
 * 如果代码块开始但没有结束，添加结束标记
 */
export const fixIncompleteCodeBlocks = (markdown: string): string => {
  const codeBlockRegex = /```[\s\S]*?```|```[\s\S]*?$/g;
  return markdown.replace(codeBlockRegex, (match) => {
    if (!match.endsWith('```')) {
      return `${match}\n\`\`\``;
    }
    return match;
  });
};

/**
 * 修复不完整的表格
 */
export const fixIncompleteTables = (markdown: string): string => {
  const lines = markdown.split('\n');
  let inTable = false;
  let tableStartIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 检测表格头部
    if (line.startsWith('|') && line.endsWith('|') && !inTable) {
      inTable = true;
      tableStartIndex = i;
    }
    
    // 检测表格分隔行
    if (inTable && i === tableStartIndex + 1) {
      if (!line.startsWith('|') || !line.endsWith('|') || !line.includes('-')) {
        // 表格格式不正确，添加分隔行
        const headerCells = lines[tableStartIndex].split('|').filter(Boolean).length;
        lines[i] = '|' + Array(headerCells).fill(' --- ').join('|') + '|';
      }
    }
  }
  
  return lines.join('\n');
};

/**
 * 在标点符号后添加换行符
 * 处理中文和英文的标点符号
 */
export const addLineBreaksAfterPunctuation = (markdown: string): string => {
  // 检查是否在代码块内
  const segments: string[] = [];
  let isInCodeBlock = false;
  let currentSegment = '';
  
  // 分割代码块和非代码块
  const lines = markdown.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检测代码块开始或结束
    if (line.trim().startsWith('```')) {
      // 保存当前段落
      segments.push(currentSegment);
      currentSegment = line + '\n';
      isInCodeBlock = !isInCodeBlock;
    } else {
      // 在代码块内，保持原样
      if (isInCodeBlock) {
        currentSegment += line + '\n';
      } else {
        // 在代码块外，处理标点符号
        currentSegment += line + '\n';
      }
    }
  }
  
  // 添加最后一个段落
  segments.push(currentSegment);
  
  // 处理非代码块部分的标点符号
  return segments.map((segment, index) => {
    // 跳过偶数索引（代码块）
    if (index % 2 === 1) return segment;
    
    // 处理中英文标点符号后添加换行
    return segment.replace(/([。！？：；!?:;])\s*(?!\n)/g, '$1\r\n');
  }).join('');
};

/**
 * 综合修复 Markdown 格式
 */
export const fixMarkdown = (markdown: string): string => {
  let fixed = markdown;
  fixed = fixIncompleteCodeBlocks(fixed);
  fixed = fixIncompleteTables(fixed);
  fixed = addLineBreaksAfterPunctuation(fixed);
  return fixed;
}; 