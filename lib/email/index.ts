interface TiptapMark {
	type: string;
	attrs?: Record<string, any>;
}

interface TiptapNode {
	type: string;
	attrs?: Record<string, any>;
	text?: string;
	marks?: TiptapMark[];
	content?: TiptapNode[];
}

const markMapping: {
	[key: string]: (mark: TiptapMark, text: string) => string;
} = {
	bold: (mark, text) => {
		return `<strong>${text}</strong>`;
	},
	underline: (mark, text) => {
		return `<u>${text}</u>`;
	},
};

function attributeStyles(attrs: Record<string, any> | undefined) {
	if (!attrs) {
		return [];
	}
	return Object.keys(attrs).map((key) => {
		if (!styleMapping[key]) {
			return '';
		}
		return styleMapping[key](attrs);
	});
}

const styleMapping: {
	[key: string]: (attrs: Record<string, any> | undefined) => string;
} = {
	textAlign: (attrs) => {
		return `text-align: ${attrs?.textAlign};`;
	},
	h1: (attrs) => {
		return [
			'font-size: 36px;',
			'font-weight: 800;',
			'line-height: 40px;',
			'margin-bottom: 12px;',
			'color: rgb(17, 24, 39);',
			...attributeStyles(attrs),
		].join('');
	},
	p: (attrs) => {
		return [
			'font-size: 15px;',
			'line-height: 24px;',
			'margin: 16px 0;',
			'margin-bottom: 20px;',
			'margin-top: 0px;',
			'color: rgb(55, 65, 81);',
			'-webkit-font-smoothing: antialiased;',
			'-moz-osx-font-smoothing: grayscale;',
			...attributeStyles(attrs),
		].join('');
	},
};

const nodeMapping: { [key: string]: (node: TiptapNode) => string } = {
	text: (node) => {
		if (node.marks) {
			return node.marks.reduce((acc, mark) => {
				return markMapping[mark.type](mark, acc);
			}, node.text || ' ');
		}

		return node.text || '';
	},
	heading: (node) => {
		return `<h${node?.attrs?.level} style="${styleMapping[
			`h${node?.attrs?.level}`
		](node?.attrs)}">${node.content
			?.map((node) => {
				return nodeMapping[node.type](node);
			})
			.join('')}</h${node?.attrs?.level}>`;
	},
	paragraph: (node) => {
		return `<p style="${styleMapping['p'](node?.attrs)}">${node.content
			?.map((node) => {
				return nodeMapping[node.type](node);
			})
			.join('')}</p>`;
	},
};

const tiptapToHtml = (tiptap: TiptapNode[]) => {
	return tiptap
		.map((node) => {
			return nodeMapping[node.type](node);
		})
		.join('');
};
console.log(
	tiptapToHtml(
		JSON.parse(
			`[{
    "type": "heading",
    "attrs": {
      "textAlign": "left",
      "level": 1
    },
    "content": [
      {
        "type": "text",
        "text": "Arik "
      },
      {
        "type": "text",
        "marks": [
          {
            "type": "bold"
          },
          {
            "type": "underline"
          }
        ],
        "text": "Chakma"
      }
    ]
  },
  {
    "type": "paragraph",
    "attrs": {
        "textAlign": "left"
    },
    "content": [
        {
            "type": "text",
            "text": "Hello "
        },
        {
            "type": "text",
            "marks": [
                {
                    "type": "bold"
                }
            ],
            "text": "Arikko"
        }
    ]
}
]`
		)
	)
);
