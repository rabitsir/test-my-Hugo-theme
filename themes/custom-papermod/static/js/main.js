/**
 * ============================================
 * Hugo PaperMod 主题 - 主脚本
 * ============================================
 * 功能:
 * - 目录树折叠/展开
 * - 标签云折叠/展开
 * - TOC折叠/展开
 * - 备案信息显示控制
 * - 搜索功能
============================================ */

(function() {
  'use strict';

  /**
   * ============================================
   * 目录树折叠/展开
   * ============================================
   * @param {HTMLElement} button - 点击的按钮元素
   */
  window.toggleFolder = function(button) {
    button.classList.toggle('expanded');
    const children = button.nextElementSibling;
    if (children) {
      children.style.display = children.style.display === 'none' ? 'block' : 'none';
    }
  };

  /**
   * ============================================
   * 标签云折叠/展开
   * ============================================
   * @param {HTMLElement} button - 点击的按钮元素
   */
  window.toggleTagCloud = function(button) {
    button.classList.toggle('expanded');
    const content = button.nextElementSibling;
    if (content) {
      content.style.display = content.style.display === 'none' ? 'flex' : 'none';
    }
  };

  /**
   * ============================================
   * TOC折叠/展开
   * ============================================
   * @param {HTMLElement} button - 点击的按钮元素
   */
  window.toggleToc = function(button) {
    button.classList.toggle('expanded');
    const content = button.nextElementSibling;
    if (content) {
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
  };

  /**
   * ============================================
   * 备案信息显示控制
   * 滚动超过200px后显示备案信息
   * ============================================
   */
  function initICPVisibility() {
    const icpFooter = document.querySelector('.icp-footer');
    if (!icpFooter) return;

    let ticking = false;

    function updateICPVisibility() {
      const scrollY = window.scrollY;
      if (scrollY > 200) {
        icpFooter.classList.add('visible');
      } else {
        icpFooter.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateICPVisibility);
        ticking = true;
      }
    });
  }

  /**
   * ============================================
   * 搜索功能
   * ============================================
   */
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;

    let searchIndex = [];

    // 加载搜索索引
    fetch('/index.json')
      .then(response => response.json())
      .then(data => {
        searchIndex = data;
      })
      .catch(error => {
        console.log('Search index not available');
      });

    // 搜索输入事件
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
      }

      const results = searchIndex.filter(item => {
        const title = (item.title || '').toLowerCase();
        const content = (item.content || '').toLowerCase();
        const summary = (item.summary || '').toLowerCase();
        return title.includes(query) || content.includes(query) || summary.includes(query);
      }).slice(0, 5);

      if (results.length > 0) {
        searchResults.innerHTML = results.map(item => `
          <a href="${item.permalink}" class="search-result-item">
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-summary">${item.summary || ''}</div>
          </a>
        `).join('');
        searchResults.style.display = 'block';
      } else {
        searchResults.innerHTML = '<div class="search-no-results">未找到相关文章</div>';
        searchResults.style.display = 'block';
      }
    });

    // 点击外部关闭搜索结果
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  /**
   * ============================================
   * TOC高亮当前章节
   * ============================================
   */
  function initTocHighlight() {
    const tocLinks = document.querySelectorAll('.toc-content a');
    if (tocLinks.length === 0) return;

    const headings = Array.from(document.querySelectorAll('h2, h3, h4'));
    if (headings.length === 0) return;

    let currentHeading = null;

    function updateTocHighlight() {
      const scrollY = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].offsetTop <= scrollY) {
          currentHeading = headings[i];
          break;
        }
      }

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (currentHeading && link.getAttribute('href') === '#' + currentHeading.id) {
          link.classList.add('active');
        }
      });
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateTocHighlight);
        ticking = true;
      }
    });

    updateTocHighlight();
  }

  /**
   * ============================================
   * 平滑滚动到锚点
   * ============================================
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * ============================================
   * 初始化所有功能
   * ============================================
   */
  function init() {
    initICPVisibility();
    initSearch();
    initTocHighlight();
    initSmoothScroll();
  }

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
