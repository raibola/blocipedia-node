'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    userId: {
      type: DataTypes.INTEGER
    }
  }, {});
  Wiki.associate = function(models) {
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return Wiki;
};