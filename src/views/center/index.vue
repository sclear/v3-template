<template>
  <!-- <ElInput v-model="k"></ElInput> -->
  <div>
    <ElCard>
      <template #header> <span class="c-primary">个人中心</span> </template>
      <Form :createOption="form" />
    </ElCard>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from "vue";
import { ElCard } from "element-plus";
import { CreateForm, Form } from "@/entry";

const form = CreateForm({
  form: [
    {
      row: [18],
      type: "Text",
      model: "name",
      label: "姓名",
    },
    {
      type: "Text",
      model: "head",
      label: "照片",
      renderFormItem({ value }) {
        return <img src={value} />;
      },
    },
    {
      type: "Text",
      model: "skill1Title",
      label: "被动",
    },
    {
      type: "Text",
      model: "skill1",
      label: "描述",
    },
    {
      type: "Text",
      model: "skill2Title",
      label: "1技能",
    },
    {
      type: "Text",
      model: "skill2",
      label: "描述",
    },
    {
      type: "Text",
      model: "skill3Title",
      label: "2技能",
    },
    {
      type: "Text",
      model: "skill3",
      label: "描述",
    },
    {
      type: "Text",
      model: "skill4Title",
      label: "3技能",
    },
    {
      type: "Text",
      model: "skill4",
      label: "描述",
    },
  ],
  data: ref({
    name: "西施",
    head: "https://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg",
    skill1Title: "少女的把戏",
    skill1: `西施抛出能量球，遇到野怪则会停下，爆炸前每0.5秒会攻击附近敌人，造成150/180/210/240/270/300(+50%法术攻击)法术伤害，除首次命中外，持续多次命中同个目标则伤害衰减为25%。首次命中减少敌人30%移速，持续1.5秒。2秒后能量球会爆炸造成150/180/210/240/270/300(+27%法术攻击)法术伤害，处于爆炸中心的敌人受到双倍的伤害。能量球会朝着被【纱缚之印】缠绕的目标移动。`,
    skill2Title: "纱缚之印",
    skill2: `西施将法器扔向指定位置，对区域内的敌人造成120/144/168/192/216/240（+18%法术加成）点法术伤害并朝法器的位置拉扯一段距离，同时纱会缠绕在一名敌人英雄身上，之后5秒内西施再次点击1技能，纱会牵引敌人朝一个方向移动一段距离。如果敌人距离西施过远，则不会受到影响。一技能可以对非英雄单位造成双倍伤害。`,
    skill3Title: "幻纱之灵",
    skill3: `西施抛出能量球，遇到野怪则会停下，爆炸前每0.5秒会攻击附近敌人，造成150/180/210/240/270/300(+50%法术攻击)法术伤害，除首次命中外，持续多次命中同个目标则伤害衰减为25%。首次命中减少敌人30%移速，持续1.5秒。2秒后能量球会爆炸造成150/180/210/240/270/300(+27%法术攻击)法术伤害，处于爆炸中心的敌人受到双倍的伤害。能量球会朝着被【纱缚之印】缠绕的目标移动。`,
    skill4Title: "心无旁骛",
    skill4: `西施将法器的力量灌注到自己体内,获得持续8秒的强化状态并刷新幻纱之灵的冷却时间。强化期间纱缚之印命中后可以连续控制敌人移动两次；同时幻纱之灵的冷却时间减半。大招开启时西施获得持续0.5秒50%的加速效果。`,
  }),
});
</script>
