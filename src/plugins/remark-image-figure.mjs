import { visit } from 'unist-util-visit';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 마크다운 이미지에 alt 텍스트가 있으면 <figure>/<figcaption>으로 감싼다.
// ![캡션](이미지주소) 형태로 작성하면 캡션이 이미지 하단에 표시된다.
export function remarkImageFigure() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.children.length !== 1 || node.children[0].type !== 'image') return;

      const image = node.children[0];
      if (!image.alt) return;

      const alt = escapeHtml(image.alt);
      const html =
        `<figure><img src="${image.url}" alt="${alt}"><figcaption>▲ ${alt}</figcaption></figure>`;

      parent.children[index] = { type: 'html', value: html };
    });
  };
}
