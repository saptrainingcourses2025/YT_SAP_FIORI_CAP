sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageBox,Fragment,MessageToast,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("customviewbookshop.controller.View1", {
        onInit() {
        },

        onsubmit: function(){   
            var title = this.getView().byId("title").getValue();
            var author = this.getView().byId("author").getValue();
            var price = this.getView().byId("price").getValue();
            var stock = this.getView().byId("stock").getValue();
            var location = this.getView().byId("location").getValue();
            var genre = this.getView().byId("genre").getValue();

            var oModel = this.getView().getModel();
            var oContext = oModel.bindList("/Books").create({
                "title": title,
                "author": author,
                "price": price,
                "stock": stock,
                "location": location,
                "genre": genre
            });
            oContext.created()
                .then(() => {
                    MessageBox.success("Product added successfully");  
                    this.getView().byId("title").setValue(null);              
                    this.getView().byId("author").setValue(null);              
                    this.getView().byId("price").setValue(null);              
                    this.getView().byId("stock").setValue(null);              
                    this.getView().byId("location").setValue(null);              
                    this.getView().byId("genre").setValue(null);
                })
                .catch((err) => {
                    MessageBox.error("Error adding new product");
                    console.error("Error adding item : " + err);
                });            
            // alert(title+" "+author+" "+price+" "+stock+" "+location+" "+genre+" ");
        },
		onCollapseExpandPress() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		}, 
        
        onAddBookPressed: function() {
            this.hideAllPanels();
            var oPanel1 = this.byId("Panel1").setVisible(true);            
        },
        onViewDetailsBookPressed(){
            this.hideAllPanels();
            var oPanel2 = this.byId("Panel2").setVisible(true);
        },
        onEditBookPressed: function(){
            this.hideAllPanels();
            var oPanel3 = this.byId("Panel3").setVisible(true);
        },
        hideAllPanels(){
            this.byId("Panel1").setVisible(false);
            this.byId("Panel2").setVisible(false);
            this.byId("Panel3").setVisible(false);
        },
        onActionPressed: function(oEvent){
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            this._oSelectedContext = oContext;

            if (!this._oActionSheet) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "customviewbookshop.view.ActionSheet",
                    controller: this
                }).then(function(oActionSheet){
                    this._oActionSheet = oActionSheet;
                    this.getView().addDependent(this._oActionSheet);
                    this._oActionSheet.openBy(oButton);
                }.bind(this));
            } else {
                this._oActionSheet.openBy(oButton);
            }
        },
        onDeletePress: function(){
            var oContext = this._oSelectedContext;
            var sBookId = oContext.getProperty("ID");
            MessageBox.confirm("Are you sure you want to delete this book with Book Id: "+sBookId+"?",{
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function(oAction){
                    if (oAction === MessageBox.Action.YES) {
                        oContext.delete("$direct").then(function(){
                            MessageBox.success("Bood Id "+sBookId+"deleted successfully!");
                        }).catch(function(oError){
                            MessageBox.error("Error deleting book id: "+sBookId+"."+oError+"Please try again later!");
                        });
                    }
                }
            });
        },
        // onEditPress: function(){
        //     var oData = this._oSelectedContext.getObject();
        //     MessageToast.show("Edit action for Item ID: "+oData.ID);
        //     this.onEditBookPressed();
        //     var product_model = this.getOwnerComponent().getModel();
        //     let aFilter = [
        //         new Filter("ID", FilterOperator.EQ, oData.ID)
        //     ];
        //     let oBinding = product_model.bindList("/Books");
        //     oBinding.filter(aFilter);

        //     oBinding.requestContexts().then(function(aContexts){
        //         if(aContexts.length > 0) {
        //             aContexts.forEach((oContext) => {
        //                 let oUser = oContext.getObject();
        //                 this.getView().byId("titleupdate").setValue(oUser.title);
        //                 this.getView().byId("authorupdate").setValue(oUser.author);
        //                 this.getView().byId("priceupdate").setValue(oUser.price);
        //                 this.getView().byId("stockupdate").setValue(oUser.stock);
        //                 this.getView().byId("locationupdate").setValue(oUser.location);
        //                 this.getView().byId("genreupdate").setValue(oUser.genre);
        //             });
        //         }else {
        //             MessageBox.error("No book found with the specific ID.");
        //         }                
        //     }).catch((oError) => {
        //         MessageBox.error("Error retrieving book details:"+oError);
        //     });
        // } 

onEditPress: function () {

    var oData = this._oSelectedContext.getObject();
    MessageToast.show("Edit action for Item ID: " + oData.ID);

    this.onEditBookPressed();

    var product_model = this.getOwnerComponent().getModel();

    let aFilter = [
        new Filter("ID", FilterOperator.EQ, oData.ID)
    ];

    let oBinding = product_model.bindList("/Books");
    oBinding.filter(aFilter);

    oBinding.requestContexts().then((aContexts) => {

        if (aContexts.length > 0) {

            aContexts.forEach((oContext) => {

                let oUser = oContext.getObject();

                this.byId("titleupdate").setValue(oUser.title);
                this.byId("authorupdate").setValue(oUser.author);
                this.byId("priceupdate").setValue(oUser.price);
                this.byId("stockupdate").setValue(oUser.stock);
                this.byId("locationupdate").setValue(oUser.location);
                this.byId("genreupdate").setValue(oUser.genre);

            });

        } else {
            MessageBox.error("No book found with the specific ID.");
        }

    }).catch((oError) => {
        MessageBox.error("Error retrieving book details: " + oError);
    });
}





    });
});
