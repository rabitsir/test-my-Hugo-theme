---
# ============================================
# 博客: 绕过付费墙，拥有一个全功能的自托管Baserow
# ============================================
title: "绕过付费墙，拥有一个全功能的自托管Baserow"
date: 2025-06-16T10:00:00+08:00
draft: false
categories: ["技术"]
tags: ["Baserow", "自托管", "数据库"]
---

使用Baserow搭建自托管数据库...

## Baserow介绍

Baserow是一个开源的Airtable替代品，提供类似Excel的界面...

## 自托管部署

使用Docker Compose快速部署...

```yaml
version: '3.8'
services:
  baserow:
    image: baserow/baserow:latest
    ports:
      - "80:80"
    volumes:
      - baserow_data:/baserow/data
volumes:
  baserow_data:
```
