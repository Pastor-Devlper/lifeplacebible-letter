// '목록에서 숨기기' 체크박스와 이 글의 링크 바로가기/복사 버튼을 한 줄에 보여주는 위젯.
// 저장되는 값은 체크 여부(true/false)뿐이다.
(function () {
  // Astro가 파일명으로 글 주소(id)를 만드는 규칙(github-slugger)과 동일하게 맞춘다.
  function toPostId(fileSlug) {
    return fileSlug
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\p{Pd}\s]/gu, '')
      .replace(/\s/g, '-');
  }

  function currentFileSlug(entry) {
    if (entry && entry.get && entry.get('newRecord')) return '';
    var fromEntry = entry && entry.get && entry.get('slug');
    if (fromEntry) return fromEntry;
    var match = location.hash.match(/\/collections\/blog\/entries\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function copyWithTextarea(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return copyWithTextarea(text);
      });
    }
    return copyWithTextarea(text);
  }

  var buttonStyle = {
    flex: 'none',
    padding: '6px 12px',
    border: '1px solid #ccd0d8',
    borderRadius: '6px',
    background: '#fff',
    color: '#1e2532',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
    lineHeight: '1.2'
  };

  var disabledButtonStyle = Object.assign({}, buttonStyle, {
    color: '#a0a6b1',
    background: '#f5f6f8',
    cursor: 'not-allowed'
  });

  var UnlistedControl = createClass({
    getInitialState: function () {
      return { copied: false };
    },

    copy: function (url) {
      var self = this;
      function flash(state) {
        self.setState({ copied: state });
        setTimeout(function () {
          self.setState({ copied: false });
        }, 1800);
      }
      copyText(url).then(
        function () {
          flash('ok');
        },
        function () {
          flash('fail');
        }
      );
    },

    render: function () {
      var self = this;
      var slug = currentFileSlug(this.props.entry);
      var url = slug ? location.origin + '/posts/' + toPostId(slug) : '';
      var checked = this.props.value === true;

      var copyLabel =
        this.state.copied === 'ok'
          ? '복사됨 ✓'
          : this.state.copied === 'fail'
            ? '직접 복사해 주세요'
            : '링크 복사';

      var buttons = url
        ? [
            h(
              'a',
              {
                key: 'open',
                href: url,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: '새로 게시하거나 수정한 뒤 1~2분 지나야 사이트에 반영됩니다.',
                style: buttonStyle
              },
              '링크 바로가기'
            ),
            h(
              'button',
              {
                key: 'copy',
                type: 'button',
                onClick: function () {
                  self.copy(url);
                },
                style: buttonStyle
              },
              copyLabel
            )
          ]
        : [
            h(
              'span',
              {
                key: 'wait',
                title: '글을 게시하면 링크를 쓸 수 있습니다.',
                style: disabledButtonStyle
              },
              '링크 바로가기'
            ),
            h(
              'span',
              {
                key: 'wait2',
                title: '글을 게시하면 링크를 쓸 수 있습니다.',
                style: disabledButtonStyle
              },
              '링크 복사'
            )
          ];

      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }
        },
        h(
          'label',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#1e2532',
              cursor: 'pointer'
            }
          },
          h('input', {
            id: this.props.forID,
            type: 'checkbox',
            checked: checked,
            onChange: function (e) {
              self.props.onChange(e.target.checked);
            },
            style: { width: '16px', height: '16px', margin: 0 }
          }),
          '목록에서 숨기기 (링크로만 접근)'
        ),
        h('div', { style: { display: 'flex', gap: '8px' } }, buttons)
      );
    }
  });

  var UnlistedPreview = createClass({
    render: function () {
      return null;
    }
  });

  CMS.registerWidget('unlisted-link', UnlistedControl, UnlistedPreview);
})();
