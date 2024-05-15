# 数据库初始化

-- 创建库
create database if not exists file_sys;

-- 切换库
use file_sys;

-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    unionId      varchar(256)                           null comment '微信开放平台id',
    mpOpenId     varchar(256)                           null comment '公众号openId',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    index idx_unionId (unionId)
) comment '用户' collate = utf8mb4_unicode_ci;

-- 帖子表
create table if not exists post
(
    id         bigint auto_increment comment 'id' primary key,
    title      varchar(512)                       null comment '标题',
    content    text                               null comment '内容',
    tags       varchar(1024)                      null comment '标签列表（json 数组）',
    thumbNum   int      default 0                 not null comment '点赞数',
    favourNum  int      default 0                 not null comment '收藏数',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId)
) comment '帖子' collate = utf8mb4_unicode_ci;

-- 帖子点赞表（硬删除）
create table if not exists post_thumb
(
    id         bigint auto_increment comment 'id' primary key,
    postId     bigint                             not null comment '帖子 id',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    index idx_postId (postId),
    index idx_userId (userId)
) comment '帖子点赞';

-- 帖子收藏表（硬删除）
create table if not exists post_favour
(
    id         bigint auto_increment comment 'id' primary key,
    postId     bigint                             not null comment '帖子 id',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    index idx_postId (postId),
    index idx_userId (userId)
) comment '帖子收藏';



create table tb_file_info
(
    id           bigint auto_increment comment 'id' primary key,
    fileInnerName   varchar(255)                           not null comment '文件内部名称（加密后）',
    filePublicName  varchar(255)                           not null comment '文件对外名称（公开）',
    fileType        varchar(100)                           not null comment '文件类型',
    fileCategory    bigint                                 not null comment '文件分类',
    fileTags        text                                   null comment '文件标签',
    fileDescription text                                   not null comment '文件描述',
    fileSize        bigint unsigned                        not null comment '文件大小（单位：字节）',
    fileSha256      char(64)                               null comment '文件sha256值',
    uploadDate      datetime     default CURRENT_TIMESTAMP not null comment '上传日期',
    downloadCount   int unsigned default 0                 not null comment '下载次数',
    uploaderId      bigint                                 not null comment '上传人ID',
    isPublic        tinyint(1)   default 1                 not null comment '是否公开（1是，0否）',
    createTime      datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime      datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete       tinyint(11)   default 0                 not null comment '逻辑删除键（1是，0否）'
)
    comment '文件信息表' charset = utf8mb4;

create index idx_createTime
    on tb_file_info (createTime);

create index idx_fileName
    on tb_file_info (fileInnerName);

create index idx_fileType
    on tb_file_info (fileType);

create index idx_isPublic
    on tb_file_info (isPublic);

create index idx_uploaderId
    on tb_file_info (uploaderId);