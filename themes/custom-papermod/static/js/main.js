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

(function () {
  'use strict';

  /**
   * ============================================
   * 目录树折叠/展开
   * ============================================
   * @param {HTMLElement} button - 点击的按钮元素
   */
  window.toggleFolder = function (button) {
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
  window.toggleTagCloud = function (button) {
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
  window.toggleToc = function (button) {
    button.classList.toggle('expanded');
    const content = button.nextElementSibling;
    if (content) {
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
  };


  /**
     * ============================================
     * 搜索功能 (带强力监控诊断版)
     * ============================================
     */
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    let searchIndex = [];

    // 1. 强制打破缓存，并打印请求地址
    const fetchUrl = '/index.json?t=' + new Date().getTime();
    console.log('🔍 [搜索功能] 正在请求数据字典:', fetchUrl);

    fetch(fetchUrl)
      .then(response => {
        if (!response.ok) throw new Error('网络请求失败: ' + response.status);
        return response.json();
      })
      .then(data => {
        // 2. 数据拿到后，在控制台汇报数量！
        console.log('✅ [搜索功能] 成功拿到数据！总共有', data.length, '篇文章。');
        console.log('📄 [搜索功能] 前 3 篇文章是:', data.slice(0, 3));
        searchIndex = data;
      })
      .catch(error => {
        console.error('❌ [搜索功能] 数据获取彻底失败:', error);
      });

    // 搜索输入事件
    searchInput.addEventListener('input', function (e) {
      const query = e.target.value.toLowerCase().trim();
      console.log('⌨️ [搜索功能] 你输入了:', query);

      if (query.length < 1) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
      }

      const results = searchIndex.filter(item => {
        const title = (item.title || '').toLowerCase();
        return title.includes(query);
      });

      console.log('🎯 [搜索功能] 匹配到了', results.length, '个结果');

      if (results.length > 0) {
        searchResults.innerHTML = results.slice(0, 10).map(item => `
          <a href="${item.permalink}" class="search-result-item">
            <div class="search-result-title">${item.title}</div>
          </a>
        `).join('');
        searchResults.style.display = 'block';
      } else {
        searchResults.innerHTML = '<div class="search-no-results">未找到相关文章</div>';
        searchResults.style.display = 'block';
      }
    });

    // 点击外部关闭搜索结果
    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });

    window.addEventListener('pagehide', function () {
      searchInput.value = '';
      searchResults.style.display = 'none';
      searchResults.innerHTML = '';
    });
  }
  /**
     * ============================================
     * 侧边栏轮换面板功能
     * ============================================
     */
  function initCarousel() {
    const tabs = document.querySelectorAll('.carousel-tab');
    const panes = document.querySelectorAll('.carousel-pane');
    if (tabs.length === 0 || panes.length === 0) return;

    let currentIndex = 0;
    let intervalId;

    // 切换面板逻辑
    window.switchCarousel = function (index) {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tabs[index].classList.add('active');
      panes[index].classList.add('active');
      currentIndex = index;
    };

    // 自动轮换（每5秒）
    function startRotation() {
      intervalId = setInterval(() => {
        let nextIndex = (currentIndex + 1) % tabs.length;
        switchCarousel(nextIndex);
      }, 5000);
    }

    function stopRotation() {
      clearInterval(intervalId);
    }

    // 绑定手动点击事件
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        switchCarousel(index);
        // 手动点击后重置定时器，避免马上自动切走
        stopRotation();
        startRotation();
      });
    });

    // 鼠标悬停时暂停轮换，移开后恢复
    const carouselContainer = document.querySelector('.widget-carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopRotation);
      carouselContainer.addEventListener('mouseleave', startRotation);
    }

    // 启动自动轮换
    startRotation();
  }
  /**
   * ============================================
   * 自动计算网站运行天数
   * ============================================
   */
  function initRunningDays() {
    const daysElement = document.getElementById('running-days');
    if (!daysElement) return;

    // 设定初始日期（格式：YYYY-MM-DD）
    const startDate = new Date('2026-02-22T00:00:00');
    const now = new Date();

    // 计算时间差（毫秒）并转换为天数（向下取整）
    const diffTime = now - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 如果天数算出来是负数（比如你把日期设在了未来），让它显示为 0
    daysElement.textContent = diffDays > 0 ? diffDays : 0;
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
    window.addEventListener('scroll', function () {
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
      anchor.addEventListener('click', function (e) {
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
    initCarousel(); // 新增这行，启动轮换功能
    initRunningDays(); // 新增：调用运行天数计算功能
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
